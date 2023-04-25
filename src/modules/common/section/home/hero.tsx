import Image from "next/image";
import React from "react";

import hero from "../../../../../public/assets/home/hero.png";
import { ConnectButton } from "@particle-network/connect-react-ui";

const Hero = () => {
  return (
    <main className="min-h-[93vh] bg-[#190E0A] lg:min-h-[88vh]">
      <div className="flex flex-col items-center text-white lg:flex-row lg:justify-between">
        <div className="mt-10 w-full pl-[4.1%] lg:w-[60%]">
          <h1 className="mb-4 text-4xl font-bold capitalize leading-[50px] md:text-5xl lg:mb-2 lg:text-[64px] lg:leading-[82px]">
            Help Us change Lives Today
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl lg:leading-[36px]">
            Support Our Charity Crowdfunding Campaign
          </p>
          <div className="mb-6 mt-4 text-white lg:mb-0 lg:mt-12 flex justify-start">
            <ConnectButton />
          </div>
        </div>
        <div className="relative h-[50vh] w-[90%] md:w-[60%] lg:h-[88vh] lg:w-[40%] ">
          <Image src={hero} alt="children" sizes="100%" fill />
        </div>
      </div>
    </main>
  );
};

export default Hero;
