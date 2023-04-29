import { type BigNumber } from "ethers";

export type AddressType = `0x${string}`;

export interface ICampaigns {
  amountRaised: BigNumber;
  campaignId: BigNumber;
  campaignImageUrl: string;
  category: string;
  claimed: boolean;
  description: boolean;
  endAt: BigNumber;
  fundraiser: AddressType;
  goal: BigNumber;
  location: string;
  startAt: BigNumber;
}

export interface IDonors {
  amount: BigNumber;
  timestamp: string;
  donorAddress: AddressType;
}
