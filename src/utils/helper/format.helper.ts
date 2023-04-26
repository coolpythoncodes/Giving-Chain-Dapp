import { utils, type BigNumber } from "ethers";

export const formatUnit = (value: BigNumber) =>
  parseFloat(utils.formatEther(value));
