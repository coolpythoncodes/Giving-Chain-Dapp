import Image from "next/image";
import { formatUnit } from "~/utils/helper";
import numeral from "numeral";
import { useEffect, useState } from "react";

import { useContractContext } from "~/context/ContractContext";
import { type ICampaigns, type IDonors } from "~/utils/interface/contract.interface";

type CampaignCardProps = {
  campaign: ICampaigns;
}

const CampaignCard = ({ campaign }:CampaignCardProps) => {
  const [donors, setDonors] = useState<IDonors[]>([]);
  const { getDonors } = useContractContext();

  useEffect(() => {
    void getDonors(campaign.campaignId).then((res:IDonors[]) => setDonors(res));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <Image
        src={campaign?.campaignImageUrl}
        alt=""
        width={413}
        height={227}
        className="w-full"
      />
      <p className="mb-4 mt-2 line-clamp-3">{campaign?.description}</p>
      <p className="text-base font-bold">
        {numeral(formatUnit(campaign?.amountRaised)).format(",")} USDC raised -{" "}
        {donors?.length} donations
      </p>
    </div>
  );
};

export default CampaignCard;
