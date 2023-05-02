import { utils, type BigNumber } from "ethers";

export const formatUnit = (value: BigNumber) =>
  parseFloat(utils.formatEther(value));

export const parseToEther = (value: number) =>
  utils.parseEther(value.toString());


  export const covertToReadableDate = (value: number) => {
    if (!value) return;
    const _date = new Date(value * 1000).toDateString();
    return _date;
  };