const { expect } = require("chai");
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

  describe("fundCampaign", () => {
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
      console.log(parseInt(ethers.utils.formatEther(campaign.amountRaised)));
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
      expect(parseInt(ethers.utils.formatEther(totalTipById))).to.equal(tip)

      const totalAmountFundedByAddress = await crowdFund.amountFundedByCampaignId(campaignId, campaignFunder.address)
      expect(parseInt(ethers.utils.formatEther(totalAmountFundedByAddress))).to.equal(1000)

      // const donorsById = await crowdFund.donorsByCampaignId(campaignId)
      // console.log(donorsById)
    });
  });
});
