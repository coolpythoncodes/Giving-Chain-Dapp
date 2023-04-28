import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import Link from "next/link";
import React from "react";
import { generalRoutes } from "~/utils/data";

import campaignImg from "../../../../../public/assets/campaign/campaign-img.png";
import { CampaignCard } from "../../component/cards";

const campaigns = [
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1200,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
  {
    campaignImageUrl: campaignImg,
    description:
      "Support Women At Risk International Foundation (WARIF) in raising $50,000 to educate 6,000 girls.",
    amountRaised: 1430,
  },
];

const Campaigns = () => {
  const items = [
    {
      label: "Gift",
      key: "1",
    },
  ];

  return (
    <main className="bg-[#FCFCFC]">
      <div className="layout-container">
        <div className="flex w-full items-center justify-between py-10">
          <h1 className="text-xl font-bold capitalize md:text-2xl lg:text-3xl">
            Fundraisers in your community
          </h1>
          <Link href={generalRoutes.createCampaign}>
            <Button className="mb-6 mt-6 h-[50px] w-[151px] border-none bg-[#FF6B00] text-base text-white lg:mb-0 lg:mt-6">
              Create campaign
            </Button>
          </Link>
        </div>
        <div className="dropdown mt-8 flex w-full justify-end">
          <Dropdown menu={{ items }} className="drop">
            <Button className="text-[#344054]">
              Sort <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="xxl:grid-cols-4 grid grid-cols-1 gap-y-9  pt-12 md:grid-cols-2 md:gap-5 md:pb-[62px] md:pt-[62px] lg:grid-cols-3">
          {campaigns?.map((item: unknown, index: number) => (
            <Link key={`campaigns-${index}`} href="/campaign/women">
              <CampaignCard campaign={item} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Campaigns;
