// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

library DataTypes {
    struct CampaignUpdate {
        string description;
        uint timestamp;
    }

    struct Campaign {
        uint campaignId;
        uint startAt;
        uint endAt;
        string category;
        address fundraiser;
        uint goal;
        uint amountRaised;
        bool claimed;
        string description;
        string location;
        string campaignUrl;
    }

    struct WordsOfSupport {
        uint campaignId;
        string supportWord;

    }

    struct Donor{
        uint amount;
        uint timestamp;
        address donorAddress;
    }
}