import React from "react";
import { SupportCard } from "../../component/cards";
import { type AddressType } from "~/utils/interface/contract.interface";

type OrganisersProps = {
  fundraiser: AddressType;
  location: string;
};

const Organisers = ({ fundraiser, location }: OrganisersProps) => {
  return (
    <div className="w-full border-b border-[#D0D5DD] py-10">
      <h1 className="mb-4 text-xl font-bold md:text-2xl">Organizer</h1>
      <SupportCard name={`${fundraiser}`} location={`${location}`} />
      {/* <SupportCard name="Faith Spoonmore" location="Parkville, MO" />
      <SupportCard name="Faith Spoonmore" location="Parkville, MO" /> */}
    </div>
  );
};

export default Organisers;
