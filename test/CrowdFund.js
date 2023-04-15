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
      const totalTipById = await crowdFund.totalTipByCampaignId(campaignId);
      expect(parseInt(ethers.utils.formatEther(totalTipById))).to.equal(tip);

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
      assert.equal(campaign.claimed, true, "claimed is false")
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
});
