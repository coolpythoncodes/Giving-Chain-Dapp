// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {Events} from "./libraries/Events.sol";
import {DataTypes} from "./libraries/DataTypes.sol";
import {Constants} from "./libraries/Constants.sol";

contract CrowdFund is Ownable{
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;
    IERC20 public immutable token;
    Counters.Counter public campaignId;

    uint public totalTip;



    mapping (uint => DataTypes.Campaign) public campaigns;
    mapping (uint => DataTypes.WordsOfSupport[]) public wordsOfSupport;
    mapping (uint => DataTypes.CampaignUpdate[]) public campaignUpdates;
    mapping (uint => mapping (address => uint)) public amountFundedByCampaignId;
    mapping (uint => DataTypes.Donor[]) public donorsByCampaignId;

    constructor(address _address) {
        token = IERC20(_address);
    }

    function createCampaign(string calldata _category, uint _goal,string calldata _description, uint _startAt, uint _endAt, string calldata _location, string calldata _campaignImageUrl ) external  {
        require(_goal >= 0, "goal can't be zero");
        require(_startAt >= block.timestamp,"start time in past");
        require(_endAt > _startAt, "end at is before start time");
        require(_endAt <= block.timestamp + Constants.MAX_RAISE_DURATION,"end at exceeds max raise duration");

        uint newCampaignId = campaignId.current();
        campaigns[newCampaignId] = DataTypes.Campaign({
            campaignId: newCampaignId,
            startAt: _startAt,
            endAt: _endAt,
            category: _category,
            fundraiser: msg.sender,
            goal: _goal, 
            amountRaised: 0,
            claimed: false,
            description: _description,
            location: _location,
            campaignImageUrl: _campaignImageUrl
        });

        campaignId.increment();
        emit Events.CreateCampaign(newCampaignId,msg.sender, _goal, _startAt, _endAt );
    }

    function fundCampaign(uint _campaignId, uint _amount, uint tip)  external {
        DataTypes.Campaign storage campaign = campaigns[_campaignId];
        require(campaign.startAt <= block.timestamp, "Campaign has not started");
        require(campaign.endAt >= block.timestamp, "Campaign has ended");
        require(_amount > 0, "amount should not be zero");
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient balance");

        
        campaign.amountRaised += _amount;
        amountFundedByCampaignId[_campaignId][msg.sender] += _amount;
        totalTip += tip;
        donorsByCampaignId[_campaignId].push(DataTypes.Donor({
            amount: _amount,
            timestamp: block.timestamp,
            donorAddress: msg.sender
        }));

        token.safeTransferFrom(msg.sender, address(this), _amount + tip);

        emit Events.FundCampaign(_campaignId,msg.sender,_amount,tip);
    }

    function claim(uint _campaignId)  external {
        DataTypes.Campaign storage campaign = campaigns[_campaignId];

        require(msg.sender == campaign.fundraiser, "caller not fundraiser");
        require(block.timestamp > campaign.endAt, "campaign has not ended");
        require(!campaign.claimed, 'claimed');

        campaign.claimed = true;

        token.safeTransfer(msg.sender,campaign.amountRaised);

        emit Events.Claim(_campaignId);
    }

    function withdrawTips() external onlyOwner {
        require(owner() == msg.sender,"caller not owner");
        token.safeTransfer(msg.sender,totalTip);

        emit Events.WithdrawTips(totalTip);
    }

    function cancelCampaign(uint _campaignId) external {
        DataTypes.Campaign memory campaign = campaigns[_campaignId];

        require(msg.sender == campaign.fundraiser,"caller not fundraiser");
        require(block.timestamp < campaign.startAt, "campaign has started");

        delete campaigns[_campaignId];

        emit Events.CancelCampaign(_campaignId);
    }

    function getCampaigns() external view returns (DataTypes.Campaign[] memory) {
        uint campaignCount = campaignId.current();
        DataTypes.Campaign[] memory  allCampaigns = new DataTypes.Campaign[](campaignCount);
        for (uint i = 0; i < campaignCount; i++) {
            DataTypes.Campaign memory currentCampaign = campaigns[i];
            allCampaigns[i] = currentCampaign;
        }
        return allCampaigns;
    }

    function getDonors(uint _campaignId)  external view returns (DataTypes.Donor[] memory) {
        DataTypes.Donor[] memory donors = donorsByCampaignId[_campaignId];
        return donors;
    }

    function createCampaignUpdate(uint _campaignId, string calldata _description) external {
        DataTypes.Campaign memory campaign = campaigns[_campaignId];

        require(msg.sender == campaign.fundraiser,"caller not fund raiser");
        require(campaign.startAt <= block.timestamp, "Campaign has not started");
        require(campaign.endAt >= block.timestamp, "Campaign has ended");

         DataTypes.CampaignUpdate[] storage campaignUpdate = campaignUpdates[_campaignId];

         campaignUpdate.push(DataTypes.CampaignUpdate({
            description: _description,
            timestamp: block.timestamp
        }));

        emit Events.CreateCampaignUpdate(_campaignId);
    }

    function getCampaignUpdate(uint _campaignId) external view  returns (DataTypes.CampaignUpdate[] memory) {
        DataTypes.CampaignUpdate[] memory updates = campaignUpdates[_campaignId];
        return updates;
    }


}
