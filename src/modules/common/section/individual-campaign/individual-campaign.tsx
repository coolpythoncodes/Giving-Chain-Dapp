import React, { useState } from "react";
import Image from "next/image";
import { TagOutlined, InfoCircleOutlined } from "@ant-design/icons";

import campaignImg from "../../../../../public/assets/campaign/campaign-img.png";
import { Button } from "antd";
import Organisers from "./organisers";
import WordsOfSupport from "./words-of-support";
import Goals from "./goals";
import DonateModal from "./donate-modal";

const IndividualCampaign = () => {

  const [showDonateModal, setShowDonateModal] = useState<boolean>(false);

  return (
    <main className="bg-[#FCFCFC]">
      <div className=" layout-container py-10 ">
        <h1 className="mb-6 text-xl font-bold capitalize md:text-2xl lg:text-3xl">
          ralph yarl
        </h1>
        <div className="w-full items-start justify-between md:flex">
          <div className="w-full md:w-[62%]">
            <div className="relative mb-5 h-[50vh] w-full lg:h-[70vh]">
              <Image src={campaignImg} alt="campaign" sizes="100%" fill />
            </div>
            <div className="flex items-center justify-between border-b border-[#D0D5DD] pb-4">
              <p className="text-base font-normal">Created April 16, 2023</p>
              <div className="flex items-center justify-between">
                <TagOutlined className="mr-2" />
                <p className="text-base font-normal">Medical</p>
              </div>
            </div>
            <p className="py-6 text-base font-normal">
              Ralph is currently at home with the family. He can ambulate and
              communicate. A true miracle considering what he survived. Each day
              is different. He has a long road ahead. However, we are very
              thankful that he is still here with us. I&apos;ve been taking the
              time to read the emails and comments to Ralph. It warms our hearts
              to see him smile at all the kind words. Thank you so much for
              loving Ralph
            </p>

            <div className="block md:hidden mb-4">
              <Goals />
            </div>

            <div className="donate-btn-container flex w-full items-center justify-between border-b border-[#D0D5DD] pb-10">
              <Button className="h-[50px] w-[47%] border-none bg-[#FF6B00] text-base text-white" onClick={() => setShowDonateModal(true)}>
                Donate
              </Button>
              <Button className="mint-btn h-[50px] w-[47%] border-2 border-[#FF6B00] bg-[#FCFCFC] text-base text-[black]">
                Mint
              </Button>
            </div>
            <Organisers />
            <WordsOfSupport />
          </div>
          <div className="hidden donation-goals-con md:block md:w-[35%]">
            <Goals />
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
      />
    </main>
  );
};

export default IndividualCampaign;
