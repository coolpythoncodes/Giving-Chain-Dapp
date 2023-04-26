import { Button } from "antd";
import React from "react";

const JoinUs = () => {
  return (
    <main className="join-us-bg flex items-center justify-center">
      <div className="layout-container flex justify-center">
        <div className="flex w-full flex-col items-center justify-center md:w-[80%]">
          <h1 className="text-center text-2xl md:text-3xl lg:text-[40px] font-[500] lg:leading-[48px] text-white">
            Join us in making a difference today by donating to our crowdfunding
            campaign.
          </h1>

          <Button className="mt-6 h-[50px] w-[151px] border-none bg-[#FF6B00] text-base text-white">
            Contact us
          </Button>
        </div>
      </div>
    </main>
  );
};

export default JoinUs;
