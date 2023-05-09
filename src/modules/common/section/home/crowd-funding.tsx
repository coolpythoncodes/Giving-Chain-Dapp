import React from "react";
import Image from "next/image";
import Link from "next/link";

import pic1 from "../../../../../public/assets/home/pic1.png";
import pic2 from "../../../../../public/assets/home/pic2.png";
import pic3 from "../../../../../public/assets/home/pic3.png";
import { Button } from "antd";
import { generalRoutes } from "~/utils/data";

const CrowdFunding = () => {
  return (
    <main className="layout-container">
      <div className="flex flex-col-reverse items-center justify-between py-[40px] md:py-[60px] lg:flex-row lg:py-[80px]">
        <div className="relative h-[50vh] w-[90%] md:w-[60%] lg:h-[70vh] lg:w-[40%] ">
          <Image src={pic1} alt="children" sizes="100%" fill />
        </div>
        <div className="w-full lg:w-[57%]">
          <p className="mb-4 text-[14px] uppercase tracking-wider text-[#101828] md:text-base">
            crowdfunding
          </p>
          <h3 className="mb-2 text-2xl font-semibold capitalize text-[#101828] md:text-3xl lg:text-4xl lg:leading-[46px]">
            do something great to help others
          </h3>
          <p className="text-lg font-medium text-[#4D5159] md:text-xl lg:text-2xl lg:leading-[36px]">
            With your support, we can continue to provide these and other
            essential services to those who need it most. We believe that by
            investing in the future of our community, we can create a brighter
            tomorrow for all.
          </p>
          <Link href={generalRoutes.createCampaign}>
            <Button className="mb-6 mt-6 h-[50px] w-[151px] border-none bg-[#FF6B00] text-base text-white lg:mb-0 lg:mt-6">
              Create campaign
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between py-[40px] md:py-[60px] lg:flex-row lg:py-[80px]">
        <div className="w-full lg:w-[57%]">
          <h3 className="mb-2 text-2xl font-semibold capitalize text-[#101828] md:text-3xl lg:text-4xl lg:leading-[46px]">
            do something great to help others
          </h3>
          <p className="text-lg font-medium text-[#4D5159] md:text-xl lg:text-2xl lg:leading-[36px]">
            With your support, we can continue to provide these and other
            essential services to those who need it most. We believe that by
            investing in the future of our community, we can create a brighter
            tomorrow for all.
          </p>
        </div>
        <div className="relative h-[50vh] w-[90%] md:w-[60%] lg:h-[70vh] lg:w-[40%] ">
          <Image src={pic2} alt="children" sizes="100%" fill />
        </div>
      </div>
      <div className="flex flex-col-reverse items-center justify-between py-[40px] md:py-[60px] lg:flex-row lg:py-[80px]">
        <div className="relative h-[50vh] w-[90%] md:w-[60%] lg:h-[70vh] lg:w-[40%] ">
          <Image src={pic3} alt="children" sizes="100%" fill />
        </div>
        <div className="w-full lg:w-[57%]">
          <p className="mb-4 text-[14px] uppercase tracking-wider text-[#101828] md:text-base">
            Contact us
          </p>
          <h3 className="mb-2 text-2xl font-semibold capitalize text-[#101828] md:text-3xl lg:text-4xl lg:leading-[46px]">
            do something great to help others
          </h3>
          <p className="text-lg font-medium text-[#4D5159] md:text-xl lg:text-2xl lg:leading-[36px]">
            With your support, we can continue to provide these and other
            essential services to those who need it most. We believe that by
            investing in the future of our community, we can create a brighter
            tomorrow for all.
          </p>
          <Button className="mb-6 mt-6 h-[50px] w-[151px] border-none bg-[#FF6B00] text-base text-white lg:mb-0 lg:mt-6">
            Contact us
          </Button>
        </div>
      </div>
    </main>
  );
};

export default CrowdFunding;
