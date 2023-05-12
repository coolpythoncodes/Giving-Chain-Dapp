import { useEffect, useMemo, useState } from "react";
import { CampaignCard } from "../../component/cards";
import { Button, Carousel } from "antd";
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

  const carouselCount = useMemo(() => {
    if (window.innerWidth <= 600) {
      return 1;
    }
    if (window.innerWidth >= 600 && window.innerWidth < 992) {
      return 2;
    }
    if (window.innerWidth >= 992 && window.innerWidth < 1500) {
      return 3;
    }
    return 4;
  }, []);

  const reversedCampaign = [...campaigns].reverse();
  const activeCampaigns = reversedCampaign?.filter(
    (item) =>
      item?.fundraiser?.toLowerCase() !== account?.toLowerCase() &&
      !hasCampaignEnded(item?.endAt)
  );

  return activeCampaigns.length > 3 ? (
    <main className="layout-container">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Support a campaign</h1>
        <Link href={generalRoutes.campaign}>
          <Button className="h-[40px] w-[100px] border-none bg-[#FF6B00] text-base text-white lg:mb-0 lg:mt-6">
            See More
          </Button>
        </Link>
      </div>

      <Carousel slidesToShow={carouselCount} autoplay dots={false}>
        {activeCampaigns?.reverse()?.map((item, index: number) => (
          <CampaignCard key={`campaigns-${index}`} campaign={item} />
        ))}
      </Carousel>
    </main>
  ) : null;
};

export default CrowdfundCampaigns;
