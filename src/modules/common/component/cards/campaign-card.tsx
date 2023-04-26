import Image from "next/image";
import { formatUnit } from "~/utils/helper";
import numeral from "numeral";
import { useEffect, useState } from "react";

import { useContractContext } from "~/context/ContractContext";

const CampaignCard = ({ campaign }) => {
  const [donors, setDonors] = useState([]);
  const { getDonors } = useContractContext();

  useEffect(() => {
    getDonors(campaign.campaignId).then((res) => setDonors(res)) as unknown;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="error">
      <Image
        src={campaign?.campaignImageUrl}
        alt=""
        width={413}
        height={227}
        className="w-full"
      />
      <p className="mb-4 mt-2 line-clamp-3">{campaign?.description}</p>
      <p className="">
        {numeral(formatUnit(campaign?.amountRaised)).format(",")} USDC raised -{" "}
        {donors?.length} donations
      </p>
    </div>
  );
};

export default CampaignCard;
