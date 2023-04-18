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
    }

    struct WordsOfSupport {
        string supportWord;
        uint timestamp;
    }

    struct Donor{
        uint amount;
        uint timestamp;
        address donorAddress;
    }
}