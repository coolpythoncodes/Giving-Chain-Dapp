// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

library Events {
        event CreateCampaign(
        uint indexed _id,
        address indexed fundraiser,
        uint goal,
        uint startAt,
        uint endAt
        );
}