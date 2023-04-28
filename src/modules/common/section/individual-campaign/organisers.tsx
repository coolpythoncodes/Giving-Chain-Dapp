import React from "react";
import { SupportCard } from "../../component/cards";

const Organisers = () => {
  return (
    <div className="w-full border-b border-[#D0D5DD] py-10">
      <h1 className="text-xl font-bold md:text-2xl mb-4">Organizer</h1>
      <SupportCard name="Faith Spoonmore" location="Parkville, MO" />
      <SupportCard name="Faith Spoonmore" location="Parkville, MO" />
      <SupportCard name="Faith Spoonmore" location="Parkville, MO" />
    </div>
  );
};

export default Organisers;
