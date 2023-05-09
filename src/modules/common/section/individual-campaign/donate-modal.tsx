import { useAccount } from "@particle-network/connect-react-ui";
import { Button, Form, Input, Modal } from "antd";
import { type BigNumber } from "ethers";
import { useRouter } from "next/router";
import numeral from "numeral";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { type CrowdFundContract } from "~/context/ContractContext";
import {
  type GiveChainTokenContract,
  useContractContext,
} from "~/context/ContractContext";
import { crowdFundContractAddress } from "~/utils/data";
import { formatUnit, parseToEther } from "~/utils/helper";
import {
  type IDonors,
  type AddressType,
  type ICampaigns,
} from "~/utils/interface/contract.interface";

interface IProps {
  showDonateModal: boolean;
  onComplete: () => void;
  fundraiser: AddressType;
  campaignId: number;
  setDonors: Dispatch<SetStateAction<IDonors[]>>;
  setPercent: Dispatch<SetStateAction<number | undefined>>;
  campaign: ICampaigns | undefined;
}

const initialFormData = {
  donationAmount: null,
  donationTipAmount: null,
};

const DonateModal = ({
  showDonateModal,
  onComplete,
  fundraiser,
  campaignId,
  setDonors,
  campaign,
  setPercent,
}: IProps) => {
  const [form] = Form.useForm();
  const account = useAccount();
  const router = useRouter()

  const [donationAmount, setDonationAmount] = useState<number>();
  const [donationTipAmount, setDonationTipAmount] = useState<number>();
  const {
    initGiveChainTokenContractAddress,
    initCrowdFundContractAddress,
    checkAllowanceBalance,
    getDonors,
    getUSDCBalance,
    setTokenBalance,
    getCampaignById
    
  } = useContractContext();
  const [isApproving, setIsApproving] = useState(false);
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const [allowanceBalance, setAllowanceBalance] = useState<number>();
  const [isDonating, setIsDonating] = useState(false);

  const handleApproval = () => {
    if (allowanceBalance && donationAmount && donationTipAmount) {
      if (allowanceBalance >= +donationAmount + +donationTipAmount) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleApproveTransaction = async () => {
    const values = (await form.validateFields()) as {
      donationAmount: number;
      donationTipAmount: number;
    };
    const amount = +values.donationAmount + +values.donationTipAmount;
    setIsApproving(true);
    const notification = toast.loading(
      "Approving transaction.(Don't leave this page)"
    );
    try {
      const contract =
        initGiveChainTokenContractAddress() as GiveChainTokenContract;
      const txHash = (await contract.approve(
        crowdFundContractAddress as AddressType,
        parseToEther(amount)
      )) as GiveChainTokenContract;
      const receipt = await txHash.wait();
      if (receipt) {
        void checkAllowanceBalance(account as AddressType).then((balance) => {
          setAllowanceBalance(balance);
        });
        toast.success(`Approval of Usdc ${amount} was successful`, {
          id: notification,
        });
      }
      setIsApproving(false);
    } catch (error) {
      toast.error("Something went wrong", {
        id: notification,
      });
      setIsApproving(false);
    }
  };

  const handleDonate = async () => {
    setIsDonating(true);
    const notification = toast.loading("Donating.(Don't leave this page)");
    try {
      const contract = initCrowdFundContractAddress() as CrowdFundContract;
      const txHash = (await contract.fundCampaign(
        campaignId,
        parseToEther(donationAmount as number),
        parseToEther(donationTipAmount as number)
      )) as CrowdFundContract;
      const receipt = await txHash.wait();
      if (receipt) {
        const thisCampaign = await getCampaignById(campaignId)
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getUSDCBalance(account as AddressType).then((res) => {
          const balance = formatUnit(res);
          setTokenBalance(balance);
        });
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getDonors(campaign?.campaignId as BigNumber).then((res: IDonors[]) =>
          setDonors(res)
        );

        const percentValue = Math.round(
          (formatUnit(thisCampaign?.amountRaised) /
            (formatUnit(campaign?.goal as BigNumber) * 10 ** 18)) *
            100
        );
        setPercent(percentValue);

        toast.success("Donation was successful", {
          id: notification,
        });
        setIsDonating(false);
        router.reload()
      }
    } catch (error) {
      toast.error("Something went wrong", {
        id: notification,
      });
      setIsDonating(false);
    }
  };

  useEffect(() => {
    if (account) {
      setIsCheckingAllowance(true);
      void checkAllowanceBalance(account as AddressType).then((balance) => {
        setAllowanceBalance(balance);
        setIsCheckingAllowance(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <Modal
      title={`Donation for ${fundraiser}`}
      open={showDonateModal}
      onCancel={onComplete}
      footer={null}
    >
      <Form autoComplete="on" form={form}>
        <h1>Enter your donation</h1>
        <div>
          <Form.Item
            initialValue={initialFormData.donationAmount}
            name="donationAmount"
            rules={[
              {
                required: true,
                message: "Donation amount is required",
              },
            ]}
          >
            <Input
              placeholder="amount"
              addonBefore={<h3>USDC</h3>}
              className="input"
              type="number"
              name="donationAmount"
              step="1"
              id="donationAmount"
              onChange={(e) => setDonationAmount(e.target.valueAsNumber)}
            />
          </Form.Item>
        </div>
        <h1>Tip amount</h1>
        <div>
          <Form.Item
            initialValue={initialFormData.donationTipAmount}
            name="donationTipAmount"
            rules={[
              {
                required: true,
                message: "Donation tip is required.",
              },
            ]}
          >
            <Input
              placeholder="amount"
              addonBefore={<h3>USDC</h3>}
              className="input"
              type="number"
              name="donationTipAmount"
              id="donationTipAmount"
              onChange={(e) => setDonationTipAmount(e.target.valueAsNumber)}
            />
          </Form.Item>
        </div>

        <div>
          <h1 className="mb-3 text-base font-bold">Your donation</h1>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p>Your donation</p>
              <p>{numeral(donationAmount).format(",")} &nbsp;USDC</p>
            </div>
            <div className="mb-3 flex items-center justify-between">
              <p>Tip</p>
              <p>{numeral(donationTipAmount).format(",")} &nbsp;USDC</p>
            </div>
            <div className="flex items-center justify-between border-t border-[#D0D5DD] py-5">
              <p>Total due today</p>
              {donationAmount && donationTipAmount ? (
                <p>
                  {numeral(+donationAmount + +donationTipAmount).format(",")}{" "}
                  &nbsp;USDC
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <>
          {isCheckingAllowance ? null : (
            <>
              {handleApproval() ? (
                <Button
                  onClick={handleDonate as VoidFunction}
                  loading={isDonating}
                  disabled={isDonating}
                  className="mt-5 h-[50px] w-full border-none bg-[#FF6B00] text-base text-white"
                >
                  Donate
                </Button>
              ) : null}
            </>
          )}
        </>
      </Form>
      <>
        {isCheckingAllowance ? (
          <p className="text-center">Checking for Approval...</p>
        ) : (
          <>
            {!handleApproval() ? (
              <Button
                disabled={isApproving}
                loading={isApproving}
                onClick={handleApproveTransaction as VoidFunction}
                className="mt-5 h-[50px] w-full border-none bg-[#FF6B00] text-base text-white disabled:bg-gray-500"
              >
                Approve
              </Button>
            ) : null}
          </>
        )}
      </>
    </Modal>
  );
};

export default DonateModal;
