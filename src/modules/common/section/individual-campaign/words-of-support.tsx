import React from "react";
import { SupportCard } from "../../component/cards";
import { Button } from "antd";

const WordsOfSupport = () => {
  return (
    <div className="w-full border-b border-[#D0D5DD] py-10">
      <h1 className="mb-4 text-xl font-bold md:text-2xl">
        Words of support (23)
      </h1>
      <p>Please donate to share words of support.</p>
      <SupportCard
        name="Faith Spoonmore"
        amount={1000}
        date="20 hrs"
        description="Ralph deserved to live a safe and happy life. I hope these donations can help repair his body and support his future"
      />
      <SupportCard
        name="Faith Spoonmore"
        amount={1000}
        date="20 hrs"
        description="Ralph deserved to live a safe and happy life. I hope these donations can help repair his body and support his future"
      />
      <SupportCard
        name="Faith Spoonmore"
        amount={1000}
        date="20 hrs"
        description="Ralph deserved to live a safe and happy life. I hope these donations can help repair his body and support his future"
      />
      <SupportCard
        name="Faith Spoonmore"
        amount={1000}
        date="20 hrs"
        description="Ralph deserved to live a safe and happy life. I hope these donations can help repair his body and support his future"
      />
      <SupportCard
        name="Faith Spoonmore"
        amount={1000}
        date="20 hrs"
        description="Ralph deserved to live a safe and happy life. I hope these donations can help repair his body and support his future"
      />
      <SupportCard
        name="Faith Spoonmore"
        amount={1000}
        date="20 hrs"
        description="Ralph deserved to live a safe and happy life. I hope these donations can help repair his body and support his future"
      />

      <div className="show-more mt-20">
        <Button className="mint-btn h-[50px] w-[200px] border-2 border-[#458E52] bg-[#FCFCFC] text-base text-[black]">
          Show more
        </Button>
      </div>
    </div>
  );
};

export default WordsOfSupport;
