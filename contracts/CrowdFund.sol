// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import {Events} from "./libraries/Events.sol";
import {DataTypes} from "./libraries/DataTypes.sol";
import {Constants} from "./libraries/Constants.sol";

contract CrowdFund {
    using Counters for Counters.Counter;
    IERC20 public immutable token;
    Counters.Counter public campaignId;


    mapping (uint => DataTypes.Campaign) public campaign;
    mapping (uint => DataTypes.WordsOfSupport[]) public wordsOfSupport;
    mapping (uint => DataTypes.CampaignUpdate[]) public campaignUpdates;

    constructor(address _address) {
        token = IERC20(_address);
    }

    function createCampaign(string calldata _category, uint _goal,string calldata _description, uint _startAt, uint _endAt, string calldata _location ) external  {
        require(_goal >= 0, "goal can't be zero");
        require(_startAt >= block.timestamp,"start time in past");
        require(_endAt > _startAt, "end at is before start time");
        require(_endAt <= block.timestamp + Constants.MAX_RAISE_DURATION,"end at exceeds max raise duration");

        uint newCampaignId = campaignId.current();
        campaign[newCampaignId] = DataTypes.Campaign({
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


}

/**
 * 
 * list of test
 * when you create a campaign, campaign id should increase
 */