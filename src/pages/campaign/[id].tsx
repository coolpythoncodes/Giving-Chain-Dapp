import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { IndividualCampaign } from "~/modules/common/section/individual-campaign";
import { useRouter } from "next/router";

const CampaignId: NextPage = () => {
  const { query } = useRouter();
  const campaignId = query.id as number | undefined ;
  return campaignId ? (
    <>
      <Head>
        <title>Giving Chain | Campaign</title>
        <meta name="description" content="Giving Chain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <IndividualCampaign {...{ campaignId }} />
    </>
  ) : null;
};

export default CampaignId;
