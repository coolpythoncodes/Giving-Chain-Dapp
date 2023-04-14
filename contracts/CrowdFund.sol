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


    mapping (uint => DataTypes.Campaign) public campaigns;
    mapping (uint => DataTypes.WordsOfSupport[]) public wordsOfSupport;
    mapping (uint => DataTypes.CampaignUpdate[]) public campaignUpdates;
    mapping (uint => mapping (address => uint)) public amountFundedByCampaignId;
    mapping (uint => uint) public totalTipByCampaignId;
    mapping (uint => DataTypes.Donor[]) public donorsByCampaignId;

    constructor(address _address) {
        token = IERC20(_address);
    }

    function createCampaign(string calldata _category, uint _goal,string calldata _description, uint _startAt, uint _endAt, string calldata _location ) external  {
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
            location: _location
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
        totalTipByCampaignId[_campaignId] += tip;
        donorsByCampaignId[_campaignId].push(DataTypes.Donor({
            amount: _amount,
            timestamp: block.timestamp,
            donorAddress: msg.sender
        }));

        token.safeTransferFrom(msg.sender, address(this), _amount + tip);

        emit Events.FundCampaign(_campaignId,msg.sender,_amount,tip);


    }


}
