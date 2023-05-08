import React from "react";
import Image, { type StaticImageData } from "next/image";
import { Button } from "antd";
import Link from "next/link";

import checklist from "../../../../../public/assets/campaign/checklist.svg";
import { generalRoutes } from "../../../../utils/data/routes.data";

const YourCampaign = () => {
  return (
    <main className="bg-[#F5F5F5]">
      <div className="layout-container flex justify-center py-[40px] md:py-[50px] lg:py-[76px]">
        <div className="w-full md:w-[80%] lg:w-[60%]">
          <h1 className="text-xl font-semibold text-[#1F1F1F] md:mb-3 md:text-[24px] md:leading-[29px]">
            Your Campaigns
          </h1>

          <div
            className="mt-[48px] flex w-full justify-center items-center flex-col bg-white p-5 md:px-[50px] md:py-[104px]"
            style={{
              boxShadow:
                "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
              borderRadius: "8px",
            }}
          >
            <Image src={checklist as StaticImageData} alt="checklist" />
            <h1 className="text-[#1F1F1F] font-semibold text-lg md:text-xl mt-4 mb-3">Your orders will show here</h1>
            <p className="text-[#475467] font-normal text-base">This is where you will fulfill orders, collect payments and track orders progress</p>
            <Link href={generalRoutes.createCampaign}>
            <Button className="mt-4 h-[50px] w-[151px] border-none bg-[#FF6B00] text-base text-white">
              Create order
            </Button>
          </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default YourCampaign;
