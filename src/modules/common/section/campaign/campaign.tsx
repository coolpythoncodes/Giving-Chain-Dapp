import { Button, List, Tabs, type TabsProps } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { generalRoutes } from "~/utils/data";
import { CampaignCard } from "../../component/cards";
import { type ICampaigns } from "~/utils/interface/contract.interface";
import { useContractContext } from "~/context/ContractContext";
import { useAccount } from "@particle-network/connect-react-ui";
import { hasCampaignEnded } from "~/utils/helper";

const Campaigns = () => {
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

  const otherCampaigns = reversedCampaign?.filter(
    (item) =>
      item?.fundraiser?.toLowerCase() !== account?.toLowerCase() &&
      !hasCampaignEnded(item?.endAt)
  );

  const myActiveCampaigns = reversedCampaign?.filter(
    (item) =>
      item?.fundraiser.toLowerCase() === account?.toLowerCase() &&
      !hasCampaignEnded(item?.endAt)
  );

  const myEndedCampaign = reversedCampaign?.filter(
    (item) =>
      item?.fundraiser.toLowerCase() === account?.toLowerCase() &&
      hasCampaignEnded(item?.endAt)
  );

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "All Campaigns",
      children: (
        <List
          grid={{
            gutter: 20,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={otherCampaigns}
          renderItem={(item) => (
            <List.Item className="">
              <CampaignCard campaign={item} />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: "2",
      label: "My active Campaigns",
      children: (
        <List
          grid={{
            gutter: 20,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={myActiveCampaigns}
          renderItem={(item) => (
            <List.Item className="">
              <CampaignCard campaign={item} />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: "3",
      label: "My  ended Campaigns",
      children: (
        <List
          grid={{
            gutter: 20,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={myEndedCampaign}
          renderItem={(item) => (
            <List.Item className="">
              <CampaignCard campaign={item} />
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <main className="bg-[#FCFCFC]">
      <div className="layout-container">
        <div className="flex w-full items-center justify-between py-10">
          <Link href={generalRoutes.createCampaign} className="ml-auto">
            <Button className="grid-cols mb-6 mt-6 h-[50px] w-[151px] border-none bg-[#FF6B00] text-base text-white lg:mb-0 lg:mt-6">
              Create campaign
            </Button>
          </Link>
        </div>

        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </main>
  );
};

export default Campaigns;
