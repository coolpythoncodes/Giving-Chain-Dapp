import { useEffect, useState } from "react";
import { CampaignCard } from "../../component/cards";
import { Carousel } from "antd";
import Link from "next/link";
// import { generalRoutes } from "../../../../utils/data/routes.data";
import { useContractContext } from "~/context/ContractContext";
import { generalRoutes } from "~/utils/data";
import { type ICampaigns } from "~/utils/interface/contract.interface";
import { useAccount } from "@particle-network/connect-react-ui";

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
  console.log(campaigns);

  return campaigns.length ? (
    <main className="layout-container">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-xl">Support a campaign</h1>
        <Link href={generalRoutes.campaign}>See more</Link>
      </div>

      <Carousel slidesToShow={3} autoplay dots={false}>
        {[...campaigns]?.reverse()?.map((item, index: number) => (
          <CampaignCard key={`campaigns-${index}`} campaign={item} />
        ))}
      </Carousel>
    </main>
  ) : null;
};

export default CrowdfundCampaigns;
