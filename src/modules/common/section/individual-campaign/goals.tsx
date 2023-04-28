import { Button, Progress } from "antd";
import numeral from "numeral";
import React, { useState } from "react";
import { LineChartOutlined } from "@ant-design/icons";

import DonateModal from "./donate-modal";

const Goals = () => {
  const [showDonateModal, setShowDonateModal] = useState<boolean>(false);

  return (
    <div className="donation-goals">
      <div className="hidden md:block">
        <div className="mb-4">
          <p className="mb-2 text-[14px]">
            <span className="text-xl font-semibold md:text-2xl">
              {numeral(3500000).format(",")}
            </span>{" "}
            USDC raised of 2,500,000 USDC goal
          </p>
          <Progress percent={50} showInfo={false} strokeColor="#51AA5D" />
          <p className="text-[14px]">92.4K donations</p>
        </div>
        <div className="pb-10 donate-btn-container">
          <Button className="mb-4 h-[50px] w-full border-none bg-[#FF6B00] text-base text-white" onClick={() => setShowDonateModal(true)}>
            Donate
          </Button>
          <Button className="mint-btn h-[50px] w-full border-2 border-[#FF6B00] text-base text-[black]">
            Mint
          </Button>
        </div>
      </div>
      <div>
        <div className="flex w-full items-center justify-start">
          <div className="mr-3 flex h-[40px] w-[40px] items-center justify-center rounded-[50%] bg-[#F1F1F1]">
            <LineChartOutlined className="text-[blue]" />
          </div>
          <p className="text-[blue]">142 people just donated</p>
        </div>
      </div>
      <DonateModal
        showDonateModal={showDonateModal}
        onComplete={() => setShowDonateModal(!showDonateModal)}
      />
    </div>
  );
};

export default Goals;
