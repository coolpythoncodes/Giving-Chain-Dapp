import { addHexPrefix, intToHex } from "@particle-network/auth";
import { useAccount } from "@particle-network/connect-react-ui";
import { Button, Form, Input, Modal } from "antd";
import numeral from "numeral";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  type GiveChainTokenContract,
  useContractContext,
} from "~/context/ContractContext";
import {
  crowdFundContractAddress,
  giveChainTokenContractAddress,
} from "~/utils/data";
import { formatUnit, parseToEther } from "~/utils/helper";
import { type AddressType } from "~/utils/interface/contract.interface";

interface IProps {
  showDonateModal: boolean;
  onComplete: () => void;
  fundraiser: AddressType;
}

const initialFormData = {
  donationAmount: null,
  donationTipAmount: null,
};

const DonateModal = ({ showDonateModal, onComplete, fundraiser }: IProps) => {
  const [form] = Form.useForm();
  const account = useAccount() as AddressType;

  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [donationTipAmount, setDonationTipAmount] = useState<number>(0);
  const { initGiveChainTokenContractAddress } = useContractContext();
  const [isApproving, setIsApproving] = useState(false);
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const [allowanceBalance, setAllowanceBalance] = useState<number>();

  const checkAllowance = async () => {
    setIsCheckingAllowance(true);
    try {
      const contract =
        initGiveChainTokenContractAddress() as GiveChainTokenContract;
      const allowance = await contract.allowance(
        account,
        giveChainTokenContractAddress
      );
      setAllowanceBalance(formatUnit(allowance));
      setIsCheckingAllowance(false);
    } catch (error) {
      toast.error("Something went wrong");
      setIsCheckingAllowance(false);
    }
  };

  // const handleApproveTransaction = async () => {
  //   setIsApproving(true);
  //   const notification = toast.loading(
  //     "Approving transaction.(Don't leave this page)"
  //   );
  //   const accounts = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });
  //   const from = accounts[0];
  //   const method = "approve";
  //   const values = (await form.validateFields()) as {
  //     donationAmount: number;
  //     donationTipAmount: number;
  //   };
  //   const amount = +values.donationAmount + +values.donationTipAmount;
  //   const params = [
  //     giveChainTokenContractAddress,
  //     "erc20_approve",
  //     [crowdFundContractAddress, parseToEther(+amount)],
  //   ];

  //   try {
  //     const result = await window.web3.currentProvider.request({
  //       method,
  //       params,
  //       from,
  //     });

  //     const gasLimit = await window.web3.eth.estimateGas({
  //       from: from,
  //       to: crowdFundContractAddress,
  //       value: "0x0",
  //       data: result,
  //     });

  //     const txnParams = {
  //       from: accounts[0],
  //       to: crowdFundContractAddress,
  //       value: "0x0",
  //       data: result,
  //       gasLimit: addHexPrefix(intToHex(gasLimit)),
  //     };
  //     window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
  //       if (error) {
  //         if (error.code !== 4011) {
  //           toast.error(error.message);
  //         }
  //         toast.error(error.message);
  //       } else {
  //         toast.success(`transaction ${hash}`);
  //       }
  //       setIsApproving(false);
  //     });
  //   } catch (e: any) {
  //     setIsApproving(false);
  //     console.log("sendERC20Approve", e);
  //     toast.error(e.message ?? e);
  //   }
  // };

  const handleApproveTransaction = async () => {
    const values = (await form.validateFields()) as {
      donationAmount: number;
      donationTipAmount: number;
    };
    const amount = +values.donationAmount + +values.donationTipAmount;
    console.log("amount", parseToEther(amount));
    setIsApproving(true);
    const notification = toast.loading(
      "Approving transaction.(Don't leave this page)"
    );
    try {
      const contract =
        initGiveChainTokenContractAddress() as GiveChainTokenContract;
      const txHash = (await contract.approve(
        crowdFundContractAddress as AddressType,
        parseToEther(+amount)
      )) as GiveChainTokenContract;
      const receipt = await txHash.wait();
      if (receipt) {
        void checkAllowance();
        toast.success(`Approval of Usdc ${amount} was successful`, {
          id: notification,
        });
      }
      setIsApproving(false);
    } catch (error) {
      toast.error("Something went wrong", {
        id: notification,
      });
      console.log(error);
      setIsApproving(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const values = await form.validateFields();

    console.log(values);
  };

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
              <p>
                {numeral(donationAmount + donationTipAmount).format(",")}{" "}
                &nbsp;USDC
              </p>
            </div>
          </div>
        </div>

        <Button
          className="mt-5 h-[50px] w-full border-none bg-[#FF6B00] text-base text-white"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={handleApproveTransaction}
        >
          Approve
        </Button>
      </Form>
    </Modal>
  );
};

export default DonateModal;
