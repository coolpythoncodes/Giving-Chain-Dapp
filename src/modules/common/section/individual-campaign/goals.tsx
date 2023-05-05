import { Button, Progress } from "antd";
import numeral from "numeral";
import { useEffect, useState } from "react";

import DonateModal from "./donate-modal";
import {
  type IDonors,
  type ICampaigns,
  type AddressType,
} from "~/utils/interface/contract.interface";
import { formatUnit } from "~/utils/helper";
import {
  type GiveChainTokenContract,
  useContractContext,
} from "~/context/ContractContext";
import { useAccount } from "@particle-network/connect-react-ui";
import { toast } from "react-hot-toast";

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
  } = useContractContext();
  const account = useAccount();

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

  useEffect(() => {
    if (campaign) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getDonors(campaign?.campaignId).then((res: IDonors[]) =>
        setDonors(res)
      );

      const percentValue = Math.round(
        (formatUnit(campaign?.amountRaised) /
          (formatUnit(campaign?.goal) * 10 ** 18)) *
          100
      );

      setPercent(percentValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);

  // useEffect(() => {
  //   if (account) {
  //     void getUSDCBalance(account as AddressType).then((res) => {
  //       const balance = formatUnit(res);
  //       setTokenBalance(balance);
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [account]);
  console.log("donors", donors);

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
        <div className="donate-btn-container pb-10">
          <Button
            className="mb-4 h-[50px] w-full border-none bg-[#FF6B00] text-base text-white"
            onClick={() => setShowDonateModal(true)}
          >
            Donate
          </Button>
          <Button
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleMint}
            disabled={isMinting}
            className="mint-btn h-[50px] w-full border-2 border-[#FF6B00] text-base text-[black]"
          >
            Mint
          </Button>
        </div>
      </div>
      {/* <div>
        <div className="flex w-full items-center justify-start">
          <div className="mr-3 flex h-[40px] w-[40px] items-center justify-center rounded-[50%] bg-[#F1F1F1]">
            <LineChartOutlined className="text-[blue]" />
          </div>
          <p className="text-[blue]">142 people just donated</p>
        </div>
      </div> */}
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
