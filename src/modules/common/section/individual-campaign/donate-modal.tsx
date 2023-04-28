/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Button, Form, Input, Modal } from "antd";
import numeral from "numeral";
import React, { useState } from "react";

interface IProps {
  showDonateModal: boolean;
  onComplete: () => void;
}

const initialFormData = {
  donationAmount: null,
  donationTipAmount: null,
};

const DonateModal = ({ showDonateModal, onComplete }: IProps) => {
  const [form] = Form.useForm();

  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [donationTipAmount, setDonationTipAmount] = useState<number>(0);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const values = await form.validateFields();

    console.log(values);
  };

  return (
    <Modal
      title="Donation for Ralph Yarl"
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
          onClick={handleSubmit}
        >
          Pay now
        </Button>
      </Form>
    </Modal>
  );
};

export default DonateModal;
