const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFund", () => {
  let crowdFund;
  let giveChainToken;
  let owner;
  let campaignFunder;

  beforeEach(async () => {
    [owner, campaignFunder] = await ethers.getSigners();
    // deploy token contract first
    const GiveChainToken = await ethers.getContractFactory("GiveChainToken");
    giveChainToken = await GiveChainToken.deploy();

    const CrowdFund = await ethers.getContractFactory("CrowdFund");
    crowdFund = await CrowdFund.deploy(giveChainToken.address);

    // mint 10,000 tokens to campaignFunder
    await giveChainToken.connect(campaignFunder).mint();
    // approve CrowdFund to spend campaignFunder tokens
    await giveChainToken
      .connect(campaignFunder)
      .approve(crowdFund.address, ethers.utils.parseEther("5000"));
  });

  describe("Deployment", () => {
    it("token address is same as token smart contract address", async () => {
      const token = await crowdFund.token();
      expect(token).to.equal(giveChainToken.address);
    });
  });

  describe("Create campaign", () => {
    it("should create a new campaign with correct values", async () => {
      const campaignId = 0;
      const category = "Education";
      const location = "Port Harcourt, Nigeria";
      const goal = 100;
      const description = "We need new computers for our computer lab";
      const startAt = Math.floor(Date.now() / 1000) + 3600; // Start after an hour
      const endAt = startAt + 86400; // End after a day

      const [_, addr1] = await ethers.getSigners();

      await crowdFund
        .connect(addr1)
        .createCampaign(category, goal, description, startAt, endAt, location);
      const campaign = await crowdFund.connect(addr1).campaigns(campaignId);

      expect(campaign.category).to.equal(category);
      expect(campaign.location).to.equal(location);
      expect(campaign.goal).to.equal(goal);
      expect(campaign.description).to.equal(description);
      expect(campaign.startAt).to.equal(startAt);
      expect(campaign.endAt).to.equal(endAt);
      expect(campaign.fundraiser).to.equal(addr1.address);
      expect(campaign.amountRaised).to.equal(0);
      expect(campaign.claimed).to.equal(false);
      expect(campaign.campaignId).to.equal(0);

      expect(await crowdFund.campaignId()).to.equal(campaignId + 1);

      expect(
        await crowdFund
          .connect(addr1)
          .createCampaign(category, goal, description, startAt, endAt, location)
      )
        .to.emit(crowdFund, "CreateCampaign")
        .withArgs(campaignId, addr1.address, goal, startAt, endAt);
    });

    it("should revert if goal is zero", async () => {
      const category = "Education";
      const location = "Port Harcourt, Nigeria";
      const goal = 0;
      const description = "We need new computers for our computer lab";
      const startAt = Math.floor(Date.now() / 1000) + 3600; // Start after an hour
      const endAt = startAt + 86400; // End after a day

      const [_, addr1] = await ethers.getSigners();

      expect(
        crowdFund.createCampaign(
          category,
          goal,
          description,
          startAt,
          endAt,
          location
        )
      ).to.be.revertedWith("goal can't be zero");
    });

    it("should revert if startAt is in the past", () => {
      const category = "Education";
      const location = "Port Harcourt, Nigeria";
      const goal = 0;
      const description = "We need new computers for our computer lab";
      const startAt = Math.floor(Date.now() / 1000) - 3600; // Start an hour ago
      const endAt = startAt + 86400; // End after a day

      expect(
        crowdFund.createCampaign(
          category,
          goal,
          description,
          startAt,
          endAt,
          location
        )
      ).to.be.revertedWith("start time in past");
    });

    it("should revert if startAt is greater than end at", () => {
      const category = "Education";
      const location = "Port Harcourt, Nigeria";
      const goal = 0;
      const description = "We need new computers for our computer lab";
      const startAt = Math.floor(Date.now() / 1000) + 3600; // Start after an hour
      const endAt = startAt - 86400; // one day before start

      expect(
        crowdFund.createCampaign(
          category,
          goal,
          description,
          startAt,
          endAt,
          location
        )
      ).to.be.revertedWith("end at is before start time");
    });

    it("should revert if endAt exceeds max raise duration", async () => {
      const category = "Education";
      const location = "Port Harcourt, Nigeria";
      const goal = 0;
      const description = "We need new computers for our computer lab";
      const startAt = Math.floor(Date.now() / 1000) + 3600; // Start after an hour

      const endAt = startAt + 111600; // 31 days after start

      expect(
        crowdFund.createCampaign(
          category,
          goal,
          description,
          startAt,
          endAt,
          location
        )
      ).to.be.revertedWith("end at exceeds max raise duration");
    });
  });

  describe("Fund Campaign", () => {
    it("should fund a campaign successfully", async () => {
      const campaignId = 0;
      const category = "Education";
      const location = "Port Harcourt, Nigeria";
      const goal = 100;
      const description = "We need new computers for our computer lab";
      const startAt = Math.floor(Date.now() / 1000) + 3600; // Start after an hour
      const endAt = startAt + 86400; // End after a day

      const amount = 500;
      const tip = 50;

      await crowdFund.createCampaign(
        category,
        goal,
        description,
        startAt,
        endAt,
        location
      );

      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine");

      await crowdFund
        .connect(campaignFunder)
        .fundCampaign(
          campaignId,
          ethers.utils.parseEther(amount.toString()),
          ethers.utils.parseEther(tip.toString())
        );

      const campaign = await crowdFund.campaigns(campaignId);
      expect(
        parseInt(ethers.utils.formatEther(campaign.amountRaised))
      ).to.equal(amount);

      expect(
        await crowdFund
          .connect(campaignFunder)
          .fundCampaign(
            campaignId,
            ethers.utils.parseEther(amount.toString()),
            ethers.utils.parseEther("0")
          )
      )
        .to.emit(crowdFund, "FundCampaign")
        .withArgs(campaignId, campaignFunder.address, amount, tip);

      // check if total tip is correct
      const totalTip = await crowdFund.totalTip();
      expect(parseInt(ethers.utils.formatEther(totalTip))).to.equal(tip);

      const totalAmountFundedByAddress =
        await crowdFund.amountFundedByCampaignId(
          campaignId,
          campaignFunder.address
        );
      expect(
        parseInt(ethers.utils.formatEther(totalAmountFundedByAddress))
      ).to.equal(1000);

      const donors = await crowdFund.donorsByCampaignId(campaignId, 0);
      assert.equal(
        parseInt(ethers.utils.formatEther(donors[0])),
        amount,
        "incorrect donation"
      );
      assert.equal(
        donors[2],
        campaignFunder.address,
        "incorrect funder address"
      );
    });

    it("should revert if caller balance is insufficient", async () => {
      const campaignId = 0;
      const category = "Education";
      const location = "Port Harcourt, Nigeria";
      const goal = 100;
      const description = "We need new computers for our computer lab";
      const startAt = Math.floor(Date.now() / 1000) + 7200; // Start after 2 hours
      const endAt = startAt + 86400; // End after a day

      const amount = 50000;
      const tip = 50;

      await crowdFund.createCampaign(
        category,
        goal,
        description,
        startAt,
        endAt,
        location
      );

      await ethers.provider.send("evm_increaseTime", [7200]);
      await ethers.provider.send("evm_mine");

      expect(
        crowdFund
          .connect(campaignFunder)
          .fundCampaign(
            campaignId,
            ethers.utils.parseEther(amount.toString()),
            ethers.utils.parseEther(tip.toString())
          )
      ).to.be.revertedWith("Insufficient balance");
    });

    it("should revert if amount to fund a campaign is zero", async () => {
      const campaignId = 0;
      const category = "Education";
      const location = "Port Harcourt, Nigeria";
      const goal = 100;
      const description = "We need new computers for our computer lab";
      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      const startAt = block.timestamp + 10800; // Start after 3 hours
      const endAt = startAt + 86400; // End after a day

      const amount = 0;
      const tip = 50;

      await crowdFund.createCampaign(
        category,
        goal,
        description,
        startAt,
        endAt,
        location
      );

      await ethers.provider.send("evm_increaseTime", [10800]);
      await ethers.provider.send("evm_mine");

      expect(
        crowdFund
          .connect(campaignFunder)
          .fundCampaign(
            campaignId,
            ethers.utils.parseEther(amount.toString()),
            ethers.utils.parseEther(tip.toString())
          )
      ).to.be.revertedWith("amount should not be zero");
    });

    it("should revert if campaign has not started", async () => {
      const campaignId = 0;
      const category = "Education";
      const location = "Port Harcourt, Nigeria";
      const goal = 100;
      const description = "We need new computers for our computer lab";
      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      const startAt = block.timestamp + 10800; // Start after 3 hours
      const endAt = startAt + 86400; // End after a day

      const amount = 500;
      const tip = 50;

      await crowdFund.createCampaign(
        category,
        goal,
        description,
        startAt,
        endAt,
        location
      );

      // await ethers.provider.send("evm_increaseTime", [10800]);
      // await ethers.provider.send("evm_mine");

      expect(
        crowdFund
          .connect(campaignFunder)
          .fundCampaign(
            campaignId,
            ethers.utils.parseEther(amount.toString()),
            ethers.utils.parseEther(tip.toString())
          )
      ).to.be.revertedWith("Campaign has not started");
    });

    it("should revert if campaign has ended started", async () => {
      const campaignId = 0;
      const category = "Education";
      const location = "Port Harcourt, Nigeria";
      const goal = 100;
      const description = "We need new computers for our computer lab";
      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      const startAt = block.timestamp + 10800; // Start after 3 hours
      const endAt = startAt + 86400; // End after a day

      const amount = 500;
      const tip = 50;

      await crowdFund.createCampaign(
        category,
        goal,
        description,
        startAt,
        endAt,
        location
      );

      await ethers.provider.send("evm_increaseTime", [172800]);
      await ethers.provider.send("evm_mine");

      expect(
        crowdFund
          .connect(campaignFunder)
          .fundCampaign(
            campaignId,
            ethers.utils.parseEther(amount.toString()),
            ethers.utils.parseEther(tip.toString())
          )
      ).to.be.revertedWith("Campaign has not started");
    });
  });

  describe("Claim campaign funds", () => {
    let fundraiser;
    let anotherUser;
    const campaignId = 0;

    beforeEach(async () => {
      [fundraiser, anotherUser] = await ethers.getSigners();
      const category = "Education";
      const location = "Port Harcourt, Nigeria";
      const goal = 100;
      const description = "We need new computers for our computer lab";
      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      const startAt = block.timestamp + 10800; // Start after 3 hours
      const endAt = startAt + 86400; // End after a day

      await crowdFund
        .connect(fundraiser)
        .createCampaign(category, goal, description, startAt, endAt, location);
    });

    it("should allow fundraiser to claim funds", async () => {
      const campaignId = 0;

      await ethers.provider.send("evm_increaseTime", [172800]);
      await ethers.provider.send("evm_mine");
      expect(crowdFund.connect(fundraiser).claim(campaignId))
        .to.emit(crowdFund, "Claim")
        .withArgs(campaignId);

      // check if claim changes to true
      const campaign = await crowdFund.campaigns(campaignId);
      assert.equal(campaign.claimed, true, "claimed is false");
    });

    it("should revert if caller is not fundraiser", async () => {
      const campaignId = 0;
      await ethers.provider.send("evm_increaseTime", [172800]);
      await ethers.provider.send("evm_mine");
      expect(
        crowdFund.connect(anotherUser).claim(campaignId)
      ).to.be.revertedWith("caller not fundraiser");
    });

    it("should revert if campaign has not ended", async () => {
      expect(
        crowdFund.connect(fundraiser).claim(campaignId)
      ).to.be.revertedWith("caller not fundraiser");
    });

    it("should revert if campaign funds has been claimed", async () => {
      await ethers.provider.send("evm_increaseTime", [172800]);
      await ethers.provider.send("evm_mine");

      await crowdFund.connect(fundraiser).claim(campaignId);
      expect(
        crowdFund.connect(fundraiser).claim(campaignId)
      ).to.be.revertedWith("claimed");
    });

    it("should increase token of fundraiser after claim", async () => {
      const amount = 500;
      const tip = 50;

      const previousBalance = await giveChainToken.balanceOf(
        fundraiser.address
      );

      await ethers.provider.send("evm_increaseTime", [10800]);
      // await ethers.provider.send("evm_increaseTime", [172800]);
      await ethers.provider.send("evm_mine");

      await crowdFund
        .connect(campaignFunder)
        .fundCampaign(
          campaignId,
          ethers.utils.parseEther(amount.toString()),
          ethers.utils.parseEther(tip.toString())
        );

      await ethers.provider.send("evm_increaseTime", [172800]);
      await ethers.provider.send("evm_mine");

      await crowdFund.connect(fundraiser).claim(campaignId);
      const currentBalance = await giveChainToken.balanceOf(fundraiser.address);
      expect(parseInt(ethers.utils.formatEther(currentBalance))).to.equal(
        parseInt(ethers.utils.formatEther(previousBalance)) +
        parseInt(ethers.utils.formatEther(currentBalance))
      );
    });
  });

  describe("Withdrawal of tips", () => {
    let fundraiser;
    let anotherUser;
    const campaignId = 0;

    beforeEach(async () => {
      [fundraiser, anotherUser] = await ethers.getSigners();
      const category = "Education";
      const location = "Port Harcourt, Nigeria";
      const goal = 100;
      const description = "We need new computers for our computer lab";
      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      const startAt = block.timestamp + 10800; // Start after 3 hours
      const endAt = startAt + 86400; // End after a day

      const amount = 100;
      const tip = 50;

      await crowdFund
        .connect(fundraiser)
        .createCampaign(category, goal, description, startAt, endAt, location);

      await ethers.provider.send("evm_increaseTime", [10800]);
      await ethers.provider.send("evm_mine");

      await crowdFund
        .connect(campaignFunder)
        .fundCampaign(
          campaignId,
          ethers.utils.parseEther(amount.toString()),
          ethers.utils.parseEther(tip.toString())
        );
    });

    it("should allow owner withdraw tips", async () => {
      const prevBalance = await giveChainToken.balanceOf(crowdFund.address);

      await crowdFund.connect(owner).withdrawTips();

      const currentTotalTip = await crowdFund.totalTip();

      const currentBalance = await giveChainToken.balanceOf(crowdFund.address);
      const calculatedCurrentBalance =
        parseInt(ethers.utils.formatEther(prevBalance)) -
        parseInt(ethers.utils.formatEther(currentTotalTip));

      assert.equal(
        parseInt(ethers.utils.formatEther(currentBalance)),
        calculatedCurrentBalance,
        "incorrect token balance"
      );
    });
  });

  describe("Cancel campaign", () => {
    beforeEach(async () => {
      [fundraiser, anotherUser] = await ethers.getSigners();
      const category = "Education";
      const location = "Port Harcourt, Nigeria";
      const goal = 100;
      const description = "We need new computers for our computer lab";
      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      const startAt = block.timestamp + 10800; // Start after 3 hours
      const endAt = startAt + 86400; // End after a day

      await crowdFund
        .connect(fundraiser)
        .createCampaign(category, goal, description, startAt, endAt, location);
    });

    it("should allow fundraiser cancel campaign when it has not started", async () => {
      const campaignId = 0;

      expect(crowdFund.connect(fundraiser).cancelCampaign(campaignId))
        .to.emit(crowdFund, "CancelCampaign")
        .withArgs(campaignId);

      const campaign = await crowdFund.campaigns(campaignId);

      assert.equal(
        ethers.utils.formatEther(campaign[0]),
        0,
        "campaign id is not zero"
      );

      assert.equal(
        ethers.utils.formatEther(campaign[1]),
        0,
        "startAt  is not zero"
      );

      assert.equal(
        ethers.utils.formatEther(campaign[2]),
        0,
        "endAt  is not zero"
      );
      assert.equal(campaign[3], 0, "catergory is not an empty string");

      assert.equal(
        campaign[4],
        "0x0000000000000000000000000000000000000000",
        "fundraiser is not a zero address"
      );

      assert.equal(
        ethers.utils.formatEther(campaign[5]),
        0,
        "goal is not zero"
      );

      assert.equal(
        ethers.utils.formatEther(campaign[6]),
        0,
        "amount raised is not zero"
      );

      assert.equal(campaign[7], false, "claimed is not false");

      assert.equal(campaign[8], "", "description is not an empty string");

      assert.equal(campaign[9], "", "location is not an empty string");
    });

    it("should revert if caller is not fundraiser", async () => {
      const campaignId = 0;
      expect(
        crowdFund.connect(fundraiser).cancelCampaign(campaignId)
      ).to.be.revertedWith("caller not fundraiser");
    });

    it("should revert if campaign has not started", async () => {
      const campaignId = 0;

      await ethers.provider.send("evm_increaseTime", [10800]);
      await ethers.provider.send("evm_mine");

      expect(
        crowdFund.connect(fundraiser).cancelCampaign(campaignId)
      ).to.be.revertedWith("campaign has started");
    });
  });

  describe("Get Campaigns", async () => {
    const campaign1 = {
      category: "Education",
      location: "Port Harcourt, Nigeria",
      goal: 100,
      description: "We need new computers for our computer lab",
      // startAt: block.timestamp + 10800, // Start after 3 hours
      // endAt: startAt + 86400, // End after a day
    };

    const campaign2 = {
      category: "Natural Distasters",
      location: "Bayelsa, Nigeria",
      goal: 5000,
      description: "Funds have destoryed farm lands",
      // startAt: block.timestamp + 3600, // Start after 1 hour
      // endAt: startAt + 86400, // End after a day
    };

    it("should return an empty array when no campaigns have been added", async () => {
      const allCampaigns = await crowdFund.getCampaigns();
      assert.deepEqual(allCampaigns, []);
    });

    it("should return the correct number of campaigns", async () => {
      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);

      await crowdFund.createCampaign(
        campaign1.category,
        campaign1.goal,
        campaign1.description,
        block.timestamp + 3600,
        block.timestamp + 3600 + 86400,
        campaign1.location
      );
      await crowdFund.createCampaign(
        campaign2.category,
        campaign2.goal,
        campaign2.description,
        block.timestamp + 10800,
        block.timestamp + 10800 + 86400,
        campaign2.location
      );

      const allCampaigns = await crowdFund.getCampaigns();
      assert.equal(allCampaigns.length, 2);
    });

    it("should be callable by anyone", async () => {
      const allCampaigns = await crowdFund.getCampaigns({
        from: await (await ethers.getSigner()).address,
      });
      assert.deepEqual(allCampaigns, []);
    });
  });

  describe("Get donors of a campaign", () => {
    const campaignId = 0;

    const amount1 = 100;
    const amount2 = 200;
    const amount3 = 300;
    const tip = 50;

    beforeEach(async () => {
      [fundraiser, donor1, donor2, donor3] = await ethers.getSigners();

      // mint 10,000 tokens to donors
      await giveChainToken.connect(donor1).mint();
      await giveChainToken.connect(donor2).mint();
      await giveChainToken.connect(donor3).mint();

      // approve CrowdFund to spend campaignFunder tokens
      await giveChainToken
        .connect(donor1)
        .approve(crowdFund.address, ethers.utils.parseEther("5000"));

      await giveChainToken
        .connect(donor2)
        .approve(crowdFund.address, ethers.utils.parseEther("5000"));

      await giveChainToken
        .connect(donor3)
        .approve(crowdFund.address, ethers.utils.parseEther("5000"));

      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      const _startAt = block.timestamp + 10800;

      const campaign = {
        category: "Education",
        location: "Port Harcourt, Nigeria",
        goal: 100,
        description: "We need new computers for our computer lab",
        startAt: _startAt, // Start after 3 hours
        endAt: _startAt + 86400, // End after a day
      };

      await crowdFund.createCampaign(
        campaign.category,
        campaign.goal,
        campaign.description,
        campaign.startAt,
        campaign.endAt,
        campaign.location
      );

      await crowdFund.createCampaign(
        campaign.category,
        campaign.goal,
        campaign.description,
        campaign.startAt,
        campaign.endAt,
        campaign.location
      );

      await ethers.provider.send("evm_increaseTime", [10800]);
      await ethers.provider.send("evm_mine");

      await crowdFund
        .connect(donor1)
        .fundCampaign(
          campaignId,
          ethers.utils.parseEther(amount1.toString()),
          ethers.utils.parseEther(tip.toString())
        );

      await crowdFund
        .connect(donor2)
        .fundCampaign(
          campaignId,
          ethers.utils.parseEther(amount2.toString()),
          ethers.utils.parseEther(tip.toString())
        );

      await crowdFund
        .connect(donor3)
        .fundCampaign(
          campaignId,
          ethers.utils.parseEther(amount3.toString()),
          ethers.utils.parseEther(tip.toString())
        );
    });

    it("should return an empty array when a campaign has no donors", async () => {
      const campaignId1 = 1;

      const donors = await crowdFund.getDonors(campaignId1);
      assert.deepEqual(donors, []);
    });

    it('should return the correct values of the donor array', async () => {
      const donors = await crowdFund.getDonors(campaignId);

      assert.equal(ethers.utils.formatEther(donors[0][0]), amount1)
      assert.equal(donors[0][2], donor1.address)
    });


    it("should return the correct number of donors for a campaign", async () => {
      const donors = await crowdFund.getDonors(campaignId);
      assert.equal(donors.length, 3);
    });

    it("should be callable by anyone", async () => {
      const donors = await crowdFund.getDonors(campaignId, {
        from: await (await ethers.getSigner()).address,
      });
      assert.equal(donors.length, 3);
    });
  });

  describe('Create Campaign Update', () => {
    let fundraiser
    let anotherUser
    const description = "goal has been reached"
    const campaignId = 0

    beforeEach(async () => {
      [fundraiser, anotherUser] = await ethers.getSigners()
      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);

      const _startAt = block.timestamp + 10800

      const campaign = {
        category: "Education",
        location: "Port Harcourt, Nigeria",
        goal: 100,
        description: "We need new computers for our computer lab",
        startAt: _startAt, // Start after 3 hours
        endAt: _startAt + 86400, // End after a day
      };

      await crowdFund.connect(fundraiser).createCampaign(
        campaign.category,
        campaign.goal,
        campaign.description,
        campaign.startAt,
        campaign.endAt,
        campaign.location
      );

    })

    it('should revert if caller is not fundraiser', async () => {

      await ethers.provider.send("evm_increaseTime", [10800]);
      await ethers.provider.send("evm_mine");

      expect(crowdFund.connect(anotherUser).createCampaignUpdate(
        campaignId,
        description
      )).to.be.revertedWith("caller not fund raiser")
    });

    it('should revert if campaign has not started', async () => {

      expect(crowdFund.connect(fundraiser).createCampaignUpdate(
        campaignId,
        description
      )).to.be.revertedWith("Campaign has not started")
    });

    it('should revert if campaign has ended', async () => {

      await ethers.provider.send("evm_increaseTime", [10800 + 87400]);
      await ethers.provider.send("evm_mine");

      // await crowdFund.connect(fundraiser).createCampaignUpdate(
      //   campaignId,
      //   description
      // )

      expect(crowdFund.connect(fundraiser).createCampaignUpdate(
        campaignId,
        description
      )).to.be.revertedWith("Campaign has ended")
    });

    it('should create campaign update', async () => {
      await ethers.provider.send("evm_increaseTime", [10800]);
      await ethers.provider.send("evm_mine");

      const tx = await crowdFund.connect(fundraiser).createCampaignUpdate(
        campaignId,
        description
      )

      // Verify that the event was emitted with the correct arguments
      expect(tx).to.emit(crowdFund, "CreateCampaignUpdate").withArgs(campaignId)

      // Verify that the campaign update was created with the correct values
      const _campaignUpdate = await crowdFund.campaignUpdates(campaignId, 0)
      assert.equal(_campaignUpdate[0], description)
    });

  })
});
