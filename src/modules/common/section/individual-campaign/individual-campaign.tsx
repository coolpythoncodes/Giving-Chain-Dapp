import React, { useEffect, useState } from "react";
import Image from "next/image";
import { TagOutlined, InfoCircleOutlined } from "@ant-design/icons";

import { Button } from "antd";
import Organisers from "./organisers";
import WordsOfSupport from "./words-of-support";
import Goals from "./goals";
import DonateModal from "./donate-modal";
import {
  type GiveChainTokenContract,
  useContractContext,
} from "~/context/ContractContext";
import { useAccount } from "@particle-network/connect-react-ui";
import {
  type AddressType,
  type ICampaigns,
} from "~/utils/interface/contract.interface";
import { toast } from "react-hot-toast";

type IndividualCampaignProps = {
  campaignId: number;
};

const IndividualCampaign = ({ campaignId }: IndividualCampaignProps) => {
  const [campaign, setCampaign] = useState<ICampaigns>();
  const [showDonateModal, setShowDonateModal] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState(false);
  // const [tokenBalance, setTokenBalance] = useState<number>();

  const { getCampaignById, initGiveChainTokenContractAddress } =
    useContractContext();

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
        // void getUSDCBalance(account as AddressType).then((res) => {
        //   const balance = formatUnit(res) * 10 ** 18;
        //   setTokenBalance(balance);
        // });
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
    if (account) {
      getCampaignById(campaignId).then((res: ICampaigns) =>
        setCampaign(res)
      ) as unknown;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  // console.log(campaign.);

  return (
    <main className="bg-[#FCFCFC]">
      <div className=" layout-container py-10 ">
        <h1 className="mb-6 text-xl font-bold capitalize md:text-2xl lg:text-3xl">
          ralph yarl
        </h1>
        <div className="w-full items-start justify-between md:flex">
          <div className="w-full md:w-[62%]">
            <div className="relative mb-5 h-[50vh] w-full lg:h-[70vh]">
              <Image
                src={campaign?.campaignImageUrl as string}
                alt="campaign"
                sizes="100%"
                fill
              />
            </div>
            <div className="flex items-center justify-between border-b border-[#D0D5DD] pb-4">
              <p className="text-base font-normal">Created April 16, 2023</p>
              <div className="flex items-center justify-between">
                <TagOutlined className="mr-2" />
                <p className="text-base font-normal">{campaign?.category}</p>
              </div>
            </div>
            <p className="py-6 text-base font-normal">
              {campaign?.description}
            </p>

            <div className="mb-4 block md:hidden">
              <Goals {...{ campaign }} minting={isMinting} />
            </div>

            <div className="donate-btn-container flex w-full items-center justify-between border-b border-[#D0D5DD] pb-10">
              <Button
                className="h-[50px] w-[47%] border-none bg-[#FF6B00] text-base text-white"
                onClick={() => setShowDonateModal(true)}
              >
                Donate
              </Button>
              <Button
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={handleMint}
                disabled={isMinting}
                className="mint-btn h-[50px] w-[47%] border-2 border-[#FF6B00] bg-[#FCFCFC] text-base text-[black]"
              >
                Mint
              </Button>
            </div>
            <Organisers />
            <WordsOfSupport />
          </div>
          <div className="donation-goals-con hidden md:block md:w-[35%]">
            <Goals {...{ campaign, campaignId }} />
          </div>
        </div>
        <div className="my-10 flex items-center justify-start">
          <InfoCircleOutlined className="text-[14px]" />
          <p className="ml-[4px] text-[14px]">Report fundraiser</p>
        </div>
      </div>

      <DonateModal
        showDonateModal={showDonateModal}
        onComplete={() => setShowDonateModal(!showDonateModal)}
        fundraiser={campaign?.fundraiser as AddressType}
      />
    </main>
  );
};

export default IndividualCampaign;
