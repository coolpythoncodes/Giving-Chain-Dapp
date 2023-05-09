import { type FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { TagOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Organisers from "./organisers";
import WordsOfSupport from "./words-of-support";
import Goals from "./goals";
import DonateModal from "./donate-modal";
import {
  type GiveChainTokenContract,
  useContractContext,
  type CrowdFundContract,
} from "~/context/ContractContext";
import { useAccount } from "@particle-network/connect-react-ui";
import {
  type IDonors,
  type ICampaigns,
  type AddressType,
  type ICampaignUpdate,
} from "~/utils/interface/contract.interface";
import { toast } from "react-hot-toast";
import {
  covertToReadableDate,
  formatUnit,
  hasCampaignEnded,
} from "~/utils/helper";
import { type BigNumber } from "ethers";
import ReactTimeAgo from "react-time-ago";

type IndividualCampaignProps = {
  campaignId: number;
};

const IndividualCampaign = ({ campaignId }: IndividualCampaignProps) => {
  const [campaign, setCampaign] = useState<ICampaigns>();
  const [showDonateModal, setShowDonateModal] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [percent, setPercent] = useState<number>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [donors, setDonors] = useState<IDonors[]>([]);
  const [campaignUpdates, setCampaignUpdates] = useState<ICampaignUpdate[]>([]);
  const [campaignUpdateText, setCampaignUpdateText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    getCampaignById,
    initGiveChainTokenContractAddress,
    initCrowdFundContractAddress,
    getUSDCBalance,
    setTokenBalance,
    getCampaignUpdate,
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
        void getUSDCBalance(account as AddressType).then((res) => {
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
    if (account) {
      getCampaignById(campaignId).then((res: ICampaigns) =>
        setCampaign(res)
      ) as unknown;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

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
        void getUSDCBalance(account as AddressType).then((res) => {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const notification = toast.loading("Submitting campaign update");
    try {
      const contract = initCrowdFundContractAddress() as CrowdFundContract;
      const txHash = (await contract.createCampaignUpdate(
        campaignId,
        campaignUpdateText
      )) as CrowdFundContract;
      const receipt = await txHash.wait();
      if (receipt) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getCampaignUpdate(campaignId).then((res: ICampaignUpdate[]) =>
          setCampaignUpdates(res)
        );
        setCampaignUpdateText("");
        setIsSubmitting(false);
        toast.success("submission was successfull", {
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
    if (account) {
      void getUSDCBalance(account as AddressType).then((res) => {
        const balance = formatUnit(res);
        setTokenBalance(balance);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    if (account) {
      void getCampaignUpdate(campaignId).then((res: ICampaignUpdate[]) =>
        setCampaignUpdates(res)
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return campaign ? (
    <main className="bg-[#FCFCFC]">
      <div className=" layout-container py-10 ">
        <h1 className="mb-6 text-xl font-bold capitalize md:text-2xl lg:text-3xl">
          {campaign?.title}
        </h1>
        <div className="w-full items-start justify-between md:flex">
          <div className="w-full md:w-[62%]">
            <div className="relative mb-5 h-[50vh] w-full lg:h-[70vh]">
              <Image
                src={campaign?.campaignImageUrl}
                alt="campaign"
                sizes="100%"
                fill
              />
            </div>
            <div className="flex items-center justify-between border-b border-[#D0D5DD] pb-4">
              <p className="text-base font-normal">
                Created {covertToReadableDate(campaign?.createdAt)}
              </p>
              <div className="flex items-center justify-between">
                <TagOutlined className="mr-2" />
                <p className="text-base font-normal">{campaign?.category}</p>
              </div>
            </div>
            <p className="py-6 text-base font-normal">
              {campaign?.description}
            </p>

            <div className="mb-4 block md:hidden">
              <Goals {...{ campaign, campaignId }} />
            </div>

            <div className="donate-btn-container flex w-full items-center justify-between border-b border-[#D0D5DD] pb-10">
              {campaign?.fundraiser?.toLowerCase() ===
              account?.toLowerCase() ? (
                <Button
                  className="h-[50px] w-[47%] border-none bg-[#FF6B00] text-base text-white"
                  disabled={!hasCampaignEnded(endAt) && campaign?.claimed}
                  onClick={handleWithdrawal as VoidFunction}
                >
                  Withdraw
                </Button>
              ) : (
                <Button
                  className="h-[50px] w-[47%] border-none bg-[#FF6B00] text-base text-white"
                  onClick={() => setShowDonateModal(true)}
                >
                  Donate
                </Button>
              )}

              <Button
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={handleMint}
                disabled={isMinting}
                className="mint-btn h-[50px] w-[47%] border-2 border-[#FF6B00] bg-[#FCFCFC] text-base text-[black]"
              >
                Mint
              </Button>
            </div>
            <Organisers
              fundraiser={campaign.fundraiser}
              location={campaign.location}
            />
            {campaign?.fundraiser.toLowerCase() === account?.toLowerCase() ? (
              <div className="mt-5 font-bold">
                <h1>Share Updates about the campaign</h1>
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <form onSubmit={handleSubmit} className="mt-5">
                  <textarea
                    name="campaignUpdate"
                    placeholder="Share Updates about the campaign"
                    required
                    className="mt-4 w-full"
                    onChange={(e) => setCampaignUpdateText(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-5 h-[50px] w-full border-none bg-[#FF6B00] text-base text-white"
                  >
                    Submit
                  </button>
                </form>
              </div>
            ) : null}
            {campaignUpdates.length > 0 ? (
              <div className="mt-5">
                <h1 className="mb-3 text-xl font-bold">
                  Updates ({campaignUpdates.length})
                </h1>
                <div className="space-y-5">
                  {campaignUpdates?.map((item, index) => (
                    <div key={`campaign-updates-${index}`}>
                      <div className="mb-3 flex items-center gap-x-2">
                        <p className="font-bold">
                          {covertToReadableDate(
                            formatUnit(item?.timestamp) * 10 ** 18
                          ) ? (
                            <ReactTimeAgo
                              date={
                                formatUnit(item?.timestamp) * 10 ** 18 * 1000
                              }
                            />
                          ) : null}{" "}
                        </p>
                        <p>by {campaign?.fundraiser}</p>
                      </div>
                      <p>{item?.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <WordsOfSupport {...{ campaignId, campaign }} />
          </div>
          <div className="donation-goals-con hidden md:block md:w-[35%]">
            <Goals {...{ campaign, campaignId }} />
          </div>
        </div>
        {/* <div className="my-10 flex items-center justify-start">
          <InfoCircleOutlined className="text-[14px]" />
          <p className="ml-[4px] text-[14px]">Report fundraiser</p>
        </div> */}
      </div>

      <DonateModal
        showDonateModal={showDonateModal}
        onComplete={() => setShowDonateModal(!showDonateModal)}
        fundraiser={campaign?.fundraiser}
        campaignId={campaignId}
        campaign={campaign}
        setDonors={setDonors}
        setPercent={setPercent}
      />
    </main>
  ) : null;
};

export default IndividualCampaign;
