const { expect } = require("chai");

describe("CrowdFund", () => {
    let crowdFund;
    let giveChainToken;

    beforeEach(async () => {
        // deploy token contract first
        const GiveChainToken = await ethers.getContractFactory("GiveChainToken");
        giveChainToken = await GiveChainToken.deploy();

        const CrowdFund = await ethers.getContractFactory("CrowdFund")
        crowdFund = await CrowdFund.deploy(giveChainToken.address);
    })

    describe('Deployment', () => {
        it('token address is same as token smart contract address', async () => {
            const token = await crowdFund.token()
            expect(token).to.equal(giveChainToken.address)
        });

    });

    describe('Create campaign', () => {
        it("should create a new campaign with correct values", async () => {
            const campaignId = 0;
            const category = "Education";
            const location = "Port Harcourt, Nigeria"
            const goal = 100;
            const description = "We need new computers for our computer lab";
            const startAt = Math.floor(Date.now() / 1000) + 3600; // Start after an hour
            const endAt = startAt + 86400; // End after a day

            const [_, addr1] = await ethers.getSigners();

            await crowdFund.connect(addr1).createCampaign(category, goal, description, startAt, endAt, location);

            const campaign = await crowdFund.connect(addr1).campaign(campaignId);

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

            expect(await crowdFund.connect(addr1).createCampaign(category, goal, description, startAt, endAt, location)).to.emit(crowdFund, "CreateCampaign").withArgs(campaignId, addr1.address, goal, startAt, endAt)
        });


        it('should revert if goal is zero', async () => {
            const category = "Education";
            const location = "Port Harcourt, Nigeria"
            const goal = 0;
            const description = "We need new computers for our computer lab";
            const startAt = Math.floor(Date.now() / 1000) + 3600; // Start after an hour
            const endAt = startAt + 86400; // End after a day

            const [_, addr1] = await ethers.getSigners();


            expect(crowdFund.createCampaign(category, goal, description, startAt, endAt, location)).to.be.revertedWith("goal can't be zero")
        });

        it('should revert if startAt is in the past', () => {
            const category = "Education";
            const location = "Port Harcourt, Nigeria"
            const goal = 0;
            const description = "We need new computers for our computer lab";
            const startAt = Math.floor(Date.now() / 1000) - 3600; // Start an hour ago
            const endAt = startAt + 86400; // End after a day

            expect(crowdFund.createCampaign(category, goal, description, startAt, endAt, location)).to.be.revertedWith("start time in past")

        });

        it('should revert if startAt is greater than end at', () => {
            const category = "Education";
            const location = "Port Harcourt, Nigeria"
            const goal = 0;
            const description = "We need new computers for our computer lab";
            const startAt = Math.floor(Date.now() / 1000) + 3600; // Start after an hour
            const endAt = startAt - 86400; // one day before start

            expect(crowdFund.createCampaign(category, goal, description, startAt, endAt, location)).to.be.revertedWith("end at is before start time")
        });

        it('should revert if endAt exceeds max raise duration', async() => {
            const category = "Education";
            const location = "Port Harcourt, Nigeria"
            const goal = 0;
            const description = "We need new computers for our computer lab";
            const startAt = Math.floor(Date.now() / 1000) + 3600; // Start after an hour

            const endAt = startAt + 111600; // 31 days after start

            expect(crowdFund.createCampaign(category, goal, description, startAt, endAt, location)).to.be.revertedWith("end at exceeds max raise duration")


        });

    });




});
