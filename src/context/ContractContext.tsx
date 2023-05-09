import { useConnectKit } from "@particle-network/connect-react-ui";
import { ParticleProvider } from "@particle-network/provider";
import { type Contract, ethers, type BigNumber } from "ethers";
import {
  type ReactNode,
  useContext,
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  crowdFundABI,
  crowdFundContractAddress,
  giveChainTokenABI,
  giveChainTokenContractAddress,
} from "~/utils/data";
import { formatUnit } from "~/utils/helper";
import {
  type IWordsOfSupport,
  type AddressType,
  type ICampaigns,
  type IDonors,
  type ICampaignUpdate,
} from "~/utils/interface/contract.interface";

interface ContractContextInterface {
  getCampaign: () => Promise<ICampaigns[]>;
  initCrowdFundContractAddress: () => Contract;
  initGiveChainTokenContractAddress: () => Contract;
  getDonors: (campaignId: BigNumber) => Promise<IDonors[]>;
  getCampaignById: (campaignId: number) => Promise<ICampaigns>;
  getUSDCBalance: (address: AddressType) => Promise<BigNumber>;
  checkAllowanceBalance: (account: AddressType) => Promise<number>;
  tokenBalance: number | undefined;
  setTokenBalance: Dispatch<SetStateAction<number | undefined>>;
  getWordsOfSupport: (campaignId: number) => Promise<IWordsOfSupport[]>;
  getCampaignUpdate: (campaignId: number) => Promise<ICampaignUpdate[]>;
}

type ContractContextProviderProps = {
  children: ReactNode;
  value?: ContractContextInterface;
};
export interface CrowdFundContract extends Contract {
  getCampaigns(): Promise<ICampaigns[]>;
  getDonors(campaignId: number): Promise<IDonors[]>;
  campaigns(campaignId: number): Promise<ICampaigns>;
  wait(): Promise<unknown>;
  createCampaign(
    category: string,
    goal: number,
    description: string,
    title: string,
    endAt: number,
    location: string,
    campaignImageUrl: string
  ): Promise<unknown>;
  fundCampaign(
    campaignId: number,
    amount: BigNumber,
    tip: BigNumber
  ): Promise<unknown>;
  claim(campaignId: number): Promise<unknown>;
  getWordsOfSupport(campaignId: number): Promise<IWordsOfSupport[]>;
  createWordOfSupport(
    campaignId: number,
    supportWord: string
  ): Promise<unknown>;
  getCampaignUpdate(campaignId: number): Promise<ICampaignUpdate[]>;
  createCampaignUpdate(
    campaignId: number,
    description: string
  ): Promise<unknown>;
}

export interface GiveChainTokenContract extends Contract {
  balanceOf(address: AddressType): Promise<BigNumber>;
  mint(): Promise<unknown>;
  wait(): Promise<unknown>;
  allowance(address: AddressType, address1: AddressType): Promise<BigNumber>;
  approve(address: AddressType, amount: BigNumber): Promise<unknown>;
}

const ContractContext = createContext<ContractContextInterface | null>(null);

const ContractContextProvider = ({
  children,
}: ContractContextProviderProps) => {
  const [tokenBalance, setTokenBalance] = useState<number>();
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

  const getWordsOfSupport = async (campaignId: number) => {
    const contract = initCrowdFundContractAddress() as CrowdFundContract;
    const result = await contract.getWordsOfSupport(campaignId);
    return result;
  };

  const getCampaignUpdate = async (campaignId: number) => {
    const contract = initCrowdFundContractAddress() as CrowdFundContract;
    const result = await contract.getCampaignUpdate(campaignId);
    return result;
  };

  const checkAllowanceBalance = async (account: AddressType) => {
    const contract =
      initGiveChainTokenContractAddress() as GiveChainTokenContract;
    const allowance = await contract.allowance(
      account,
      crowdFundContractAddress
    );
    return formatUnit(allowance);
  };

  return (
    <ContractContext.Provider
      value={{
        getWordsOfSupport,
        initCrowdFundContractAddress,
        initGiveChainTokenContractAddress,
        getCampaign,
        getDonors,
        getCampaignById,
        getUSDCBalance,
        checkAllowanceBalance,
        tokenBalance,
        setTokenBalance,
        getCampaignUpdate,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

const useContractContext = () =>
  useContext(ContractContext) as ContractContextInterface;

export { ContractContextProvider, useContractContext };
