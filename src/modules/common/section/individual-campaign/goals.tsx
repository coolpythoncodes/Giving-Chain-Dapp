import { Button, Progress } from "antd";
import numeral from "numeral";
import { useEffect, useState } from "react";

import DonateModal from "./donate-modal";
import {
  type IDonors,
  type ICampaigns,
  type AddressType,
} from "~/utils/interface/contract.interface";
import {
  covertToReadableDate,
  formatUnit,
  hasCampaignEnded,
} from "~/utils/helper";
import {
  type GiveChainTokenContract,
  useContractContext,
  type CrowdFundContract,
} from "~/context/ContractContext";
import { useAccount } from "@particle-network/connect-react-ui";
import { toast } from "react-hot-toast";
import ReactTimeAgo from "react-time-ago";
import { type BigNumber } from "ethers";

type GoalsProps = {
  campaign: ICampaigns | undefined;
  campaignId: number;
};

const Goals = ({ campaign, campaignId }: GoalsProps) => {
  const [showDonateModal, setShowDonateModal] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState(false);
  const [percent, setPercent] = useState<number>();
  const [donors, setDonors] = useState<IDonors[]>([]);

  const {
    getDonors,
    getUSDCBalance,
    initGiveChainTokenContractAddress,
    tokenBalance,
    setTokenBalance,
    initCrowdFundContractAddress,
  } = useContractContext();
  const account = useAccount();

  const endAt = campaign?.endAt as BigNumber;

  const handleMint = async () => {
    const notification = toast.loading("Minting testnet USDC");
    setIsMinting(true);
    try {
      const contract =
        initGiveChainTokenContractAddress() as GiveChainTokenContract;
      const txHash = (await contract.mint()) as GiveChainTokenContract;
      const receipt = await txHash.wait();
      if (receipt) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getUSDCBalance(account as AddressType).then((res) => {
          const balance = formatUnit(res);
          setTokenBalance(balance);
        });
        setIsMinting(false);
        toast.success("Testnet USDC has been minted successfully", {
          id: notification,
        });
      }
    } catch (error) {
      setIsMinting(false);
      toast.error("Opps, something went wrong", {
        id: notification,
      });
    }
  };

  const handleWithdrawal = async () => {
    const amountRaised = campaign?.amountRaised as BigNumber;
    if (formatUnit(amountRaised) === 0) {
      toast.error("There is no funds to withdraw");
      return;
    }

    if (campaign?.claimed) {
      toast.error("The funds of this campaign has been withdrawed");
      return;
    }

    const notification = toast.loading("Withdrawing campaign funds.");
    try {
      const contract = initCrowdFundContractAddress() as CrowdFundContract;
      const txHash = (await contract.claim(campaignId)) as CrowdFundContract;
      const receipt = await txHash.wait();
      if (receipt) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getUSDCBalance(account as AddressType).then((res) => {
          const balance = formatUnit(res);
          setTokenBalance(balance);
        });
        toast.success("Campaign funds withdrawal was successfull", {
          id: notification,
        });
      }
    } catch (error) {
      toast.error("Opps, something went wrong", {
        id: notification,
      });
    }
  };

  useEffect(() => {
    if (campaign) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getDonors(campaign?.campaignId).then((res: IDonors[]) => setDonors(res));

      const percentValue = Math.round(
        (formatUnit(campaign?.amountRaised) /
          (formatUnit(campaign?.goal) * 10 ** 18)) *
          100
      );

      setPercent(percentValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);

  return campaign ? (
    <div className="donation-goals">
      <div className="hidden md:block">
        <div className="mb-4">
          <p className="mb-2 text-[14px]">
            <span className="text-xl font-semibold md:text-2xl">
              {numeral(formatUnit(campaign?.amountRaised)).format(",")}
            </span>{" "}
            USDC raised of{" "}
            {numeral(formatUnit(campaign?.goal) * 10 ** 18).format(",")} USDC
            goal
          </p>
          <Progress percent={percent} showInfo={false} strokeColor="#51AA5D" />
          <p className="text-[14px]">{donors.length} donations</p>
          <p>Your USDC balance: {numeral(tokenBalance).format(",")}</p>
        </div>
        <div className="donate-btn-container border-b border-gray-500 pb-5">
          {campaign?.fundraiser?.toLowerCase() === account?.toLowerCase() ? (
            <Button
              className="mb-4 h-[50px] w-full border-none bg-[#FF6B00] text-base text-white disabled:cursor-not-allowed disabled:bg-gray-600"
              disabled={!hasCampaignEnded(endAt) && campaign?.claimed}
              onClick={handleWithdrawal as VoidFunction}
            >
              Withdraw
            </Button>
          ) : (
            <Button
              className="mb-4 h-[50px] w-full border-none bg-[#FF6B00] text-base text-white"
              onClick={() => setShowDonateModal(true)}
            >
              Donate
            </Button>
          )}

          <Button
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleMint}
            disabled={isMinting}
            className="mint-btn h-[50px] w-full border-2 border-[#FF6B00] text-base text-[black]"
          >
            Mint
          </Button>
        </div>

        <div className="h-[300px] space-y-4 overflow-y-auto pt-5">
          {donors?.map((item, index) => (
            <div key={`donors-${index}`}>
              <p className="">{item?.donorAddress}</p>
              <div className="flex items-center">
                <p className="font-bold">
                  {numeral(formatUnit(item?.amount)).format(",")} USDC
                </p>
                *
                <p className="">
                  {covertToReadableDate(
                    formatUnit(item?.timestamp) * 10 ** 18
                  ) ? (
                    <ReactTimeAgo
                      date={formatUnit(item?.timestamp) * 10 ** 18 * 1000}
                    />
                  ) : null}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DonateModal
        showDonateModal={showDonateModal}
        onComplete={() => setShowDonateModal(!showDonateModal)}
        fundraiser={campaign.fundraiser}
        campaignId={campaignId}
        setDonors={setDonors}
        campaign={campaign}
        setPercent={setPercent}
      />
    </div>
  ) : null;
};

export default Goals;
