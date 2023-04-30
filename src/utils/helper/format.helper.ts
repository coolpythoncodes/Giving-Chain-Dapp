import { utils, type BigNumber } from "ethers";

export const formatUnit = (value: BigNumber) =>
  parseFloat(utils.formatEther(value));

export const parseToEther = (value: number) =>
  utils.parseEther(value.toString());
