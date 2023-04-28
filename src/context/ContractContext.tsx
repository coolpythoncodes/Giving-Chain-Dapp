import { type ExternalProvider } from "@ethersproject/providers";
import { type Contract, ethers, type BigNumber, utils } from "ethers";
import { type ReactNode, useContext, createContext } from "react";
import { crowdFundABI, crowdFundContractAddress } from "~/utils/data";

interface ContractContextInterface {
  getCampaign: () => Promise<unknown>;
  initCrowdFundContractAddress: () => "Connect your wallet" | Contract;
  getDonors: (campaignId: BigNumber) => Promise<unknown>;
}

type ContractContextProviderProps = {
  children: ReactNode;
  value?: ContractContextInterface;
};
export interface CrowdFundContract extends Contract {
  getCampaigns(): Promise<unknown>;
  getDonors(campaignId: number): Promise<unknown>;
}

const ContractContext = createContext<ContractContextInterface | null>(null);

const ContractContextProvider = ({
  children,
}: ContractContextProviderProps) => {
  const initCrowdFundContractAddress = () => {
    // try {
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as ExternalProvider
    );
    // const signer = provider.getSigner();
    const _contract = new ethers.Contract(
      crowdFundContractAddress,
      crowdFundABI.abi,
      provider
    );

    return _contract;
    // } catch (error) {
    //   throw Error("Address is Null");
    // }
  };
  const getCampaign = async (): Promise<unknown> => {
    const contract = initCrowdFundContractAddress() as CrowdFundContract;
    const result = await contract.getCampaigns();
    return result;
  };

  const getDonors = async (campaignId: BigNumber) => {
    const contract = initCrowdFundContractAddress() as CrowdFundContract;
    const _campaignId = +utils.formatEther(campaignId) * 10 ** 18;
    const result = await contract.getDonors(_campaignId);
    return result;
  };
  return (
    <ContractContext.Provider
      value={{ initCrowdFundContractAddress, getCampaign, getDonors }}
    >
      {children}
    </ContractContext.Provider>
  );
};

const useContractContext = () =>
  useContext(ContractContext) as ContractContextInterface;

export { ContractContextProvider, useContractContext };
