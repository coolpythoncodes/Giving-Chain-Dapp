import { type ExternalProvider } from "@ethersproject/providers";
import { useConnectKit } from "@particle-network/connect-react-ui";
import { ParticleProvider } from "@particle-network/provider";
import { type Contract, ethers, type BigNumber } from "ethers";
import { type ReactNode, useContext, createContext } from "react";
import {
  crowdFundABI,
  crowdFundContractAddress,
  giveChainTokenABI,
  giveChainTokenContractAddress,
} from "~/utils/data";
import { formatUnit } from "~/utils/helper";
import {
  type AddressType,
  type ICampaigns,
  type IDonors,
} from "~/utils/interface/contract.interface";

interface ContractContextInterface {
  getCampaign: () => Promise<ICampaigns[]>;
  initCrowdFundContractAddress: () => Contract;
  initGiveChainTokenContractAddress: () => Contract;
  getDonors: (campaignId: BigNumber) => Promise<IDonors[]>;
  getCampaignById: (campaignId: number) => Promise<ICampaigns>;
  getUSDCBalance: (address: AddressType) => Promise<BigNumber>;
}

type ContractContextProviderProps = {
  children: ReactNode;
  value?: ContractContextInterface;
};
export interface CrowdFundContract extends Contract {
  getCampaigns(): Promise<ICampaigns[]>;
  getDonors(campaignId: number): Promise<IDonors[]>;
  campaigns(campaignId: number): Promise<ICampaigns>;
  createCampaign(
    category: string,
    goal: number,
    description: string,
    title: string,
    endAt: number,
    location: string,
    campaignImageUrl: string
  ): Promise<unknown>;
}

export interface GiveChainTokenContract extends Contract {
  balanceOf(address: AddressType): Promise<BigNumber>;
  mint(): Promise<unknown>;
  wait(): Promise<unknown>;
  allowance(address: AddressType, address1: AddressType): Promise<BigNumber>;
  approve(address: AddressType, amount: number): Promise<unknown>;
}

const ContractContext = createContext<ContractContextInterface | null>(null);

const ContractContextProvider = ({
  children,
}: ContractContextProviderProps) => {
  const { particle } = useConnectKit();
  const particleProvider = new ParticleProvider(particle.auth);
  const initCrowdFundContractAddress = () => {
    const provider = new ethers.providers.Web3Provider(particleProvider, "any");
    const signer = provider.getSigner();
    const _contract = new ethers.Contract(
      crowdFundContractAddress,
      crowdFundABI.abi,
      signer
    );
    return _contract;
  };
  const initGiveChainTokenContractAddress = () => {
    const provider = new ethers.providers.Web3Provider(particleProvider, "any");
    const signer = provider.getSigner();

    const _contract = new ethers.Contract(
      giveChainTokenContractAddress,
      giveChainTokenABI.abi,
      signer
    );
    return _contract;
  };

  const getCampaign = async (): Promise<ICampaigns[]> => {
    const contract = initCrowdFundContractAddress() as CrowdFundContract;
    const result = await contract.getCampaigns();
    return result;
  };

  const getDonors = async (campaignId: BigNumber) => {
    const contract = initCrowdFundContractAddress() as CrowdFundContract;
    const _campaignId = +formatUnit(campaignId) * 10 ** 18;
    const result = await contract.getDonors(_campaignId);
    return result;
  };

  const getCampaignById = async (campaignId: number) => {
    const contract = initCrowdFundContractAddress() as CrowdFundContract;
    const result = await contract.campaigns(campaignId);
    return result;
  };

  const getUSDCBalance = async (address: AddressType) => {
    const contract =
      initGiveChainTokenContractAddress() as GiveChainTokenContract;
    const result = await contract.balanceOf(address);
    return result;
  };

  return (
    <ContractContext.Provider
      value={{
        initCrowdFundContractAddress,
        initGiveChainTokenContractAddress,
        getCampaign,
        getDonors,
        getCampaignById,
        getUSDCBalance,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

const useContractContext = () =>
  useContext(ContractContext) as ContractContextInterface;

export { ContractContextProvider, useContractContext };
