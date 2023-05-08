import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { formatUnit } from "~/utils/helper";
import numeral from "numeral";

// import { type BigNumber } from "ethers";

interface IProps {
  name: string;
  amount?: number;
  date?: string;
  location?: string;
  description?: string;
}

const SupportCard = (props: IProps) => {
  const { name, amount, date, location, description } = props;
  return (
    <section className="mt-7 flex w-full items-start justify-start ">
      <div
        className={`h-[40px] w-[40px] rounded-[50%] ${
          location ? "bg-[#F1F1F1]" : "bg-[#E6F6EF]"
        } flex items-center justify-center`}
      >
        <UserOutlined
          className={`text-[25px] ${
            location ? "text-[#6E6E6E]" : "text-[#458E52]"
          }`}
        />
      </div>
      <div className="ml-5 w-full">
        <h3 className="mb-[6px] text-base font-bold">{name}</h3>
        {amount && (
          <div>
            <div className="flex w-[full] items-center justify-start mb-[6px] text-[14px]">
              {/* <p>{numeral(formatUnit(amount)).format(",")} USDC</p> */}
              <span className="flex justify-start py-0">
                <p>{numeral(amount).format(",")}</p>
                <p className="ml-[2px]"> USDC</p>
              </span>
              <div className="w-[5px] h-[5px] rounded-[50%] bg-[#D0D5DD] mx-5"/>
              <p>{date}</p>
            </div>
            <p className="text-[14px]">{description}</p>
          </div>
        )}

        {location && (
          <>
            <p className="mb-[6px] text-[14px]">Organizer</p>
            <p className="text-[14px]">{location}</p>
          </>
        )}
      </div>
    </section>
  );
};

export default SupportCard;
