import Image from "next/image";
import { formatUnit } from "~/utils/helper";
import numeral from "numeral";
import { useEffect, useState } from "react";

import { useContractContext } from "~/context/ContractContext";
import {
  type ICampaigns,
  type IDonors,
} from "~/utils/interface/contract.interface";
import Link from "next/link";

type CampaignCardProps = {
  campaign: ICampaigns;
};

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const [donors, setDonors] = useState<IDonors[]>([]);
  const { getDonors } = useContractContext();

  const campaignId = formatUnit(campaign.campaignId) * 10 ** 18;

  useEffect(() => {
    void getDonors(campaign.campaignId).then((res: IDonors[]) =>
      setDonors(res)
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Link href={`/campaign/${campaignId}`} className="text-black">
      <Image
        src={campaign?.campaignImageUrl}
        alt=""
        width={413}
        height={227}
        className="w-full"
      />
      <h1 className="font-bold">{campaign?.title}</h1>
      <p className="mb-4 mt-2 line-clamp-3">{campaign?.description}</p>
      <p className="text-base font-bold">
        {numeral(formatUnit(campaign?.amountRaised)).format(",")} USDC raised -{" "}
        {donors?.length} donations
      </p>
    </Link>
  );
};

export default CampaignCard;
