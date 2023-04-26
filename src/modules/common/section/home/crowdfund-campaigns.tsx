// import { useAccount, useContractRead } from "wagmi";
import { useAccount } from "@particle-network/connect-react-ui";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { crowdFundABI, crowdFundContractAddress } from "~/utils/data";
import { CampaignCard } from "../../component/cards";
import { Carousel } from "antd";
import Link from "next/link";
import { generalRoutes } from "../../utils/data/routes.data";

const CrowdfundCampaigns = () => {
  const [campaigns, setCampaigns] = useState();
  const account = useAccount();
  const getCampaign = async () => {
    if (!account) setCampaigns([]);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    const _contract = new ethers.Contract(
      crowdFundContractAddress,
      crowdFundABI.abi,
      provider
    );

    const response = await _contract.getCampaigns();
    return response;
  };

  //   getDonors
  useEffect(() => {
    getCampaign().then((res) => setCampaigns(res));
  }, [account]);

  console.log(`campaigns`, campaigns);

  return (
    <main className="layout-container">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-xl">Support a campaign</h1>
        <Link href={generalRoutes.campaign}>See more</Link>
      </div>

      <Carousel slidesToShow={3} autoplay>
        {campaigns?.map((item, index) => (
          <CampaignCard key={`campaigns-${index}`} campaign={item} />
        ))}
      </Carousel>
    </main>
  );
};

export default CrowdfundCampaigns;
