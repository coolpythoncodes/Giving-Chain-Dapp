import { useEffect, useState } from "react";
import { CampaignCard } from "../../component/cards";
import { Carousel } from "antd";
import Link from "next/link";
import { useContractContext } from "~/context/ContractContext";
import { generalRoutes } from "~/utils/data";
import { type ICampaigns } from "~/utils/interface/contract.interface";
import { useAccount } from "@particle-network/connect-react-ui";
import { hasCampaignEnded } from "~/utils/helper";

const CrowdfundCampaigns = () => {
  const [campaigns, setCampaigns] = useState<ICampaigns[]>([]);
  const { getCampaign } = useContractContext();
  const account = useAccount();

  useEffect(() => {
    if (account) {
      getCampaign().then((res: ICampaigns[]) => setCampaigns(res)) as unknown;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const reversedCampaign = [...campaigns].reverse();
  const activeCampaigns = reversedCampaign?.filter(
    (item) =>
      item?.fundraiser?.toLowerCase() !== account?.toLowerCase() &&
      !hasCampaignEnded(item?.endAt)
  );

  return activeCampaigns.length > 3 ? (
    <main className="layout-container">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-xl">Support a campaign</h1>
        <Link href={generalRoutes.campaign}>See more</Link>
      </div>

      <Carousel slidesToShow={3} autoplay dots={false}>
        {activeCampaigns?.reverse()?.map((item, index: number) => (
          <CampaignCard key={`campaigns-${index}`} campaign={item} />
        ))}
      </Carousel>
    </main>
  ) : null;
};

export default CrowdfundCampaigns;
