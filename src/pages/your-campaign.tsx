import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { YourCampaigns } from "~/modules/common/section/your-campaign";

const YourCampaign: NextPage = () => {
  return (
    <>
      <Head>
        <title>Giving Chain | Campaign</title>
        <meta name="description" content="Giving Chain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <YourCampaigns />
    </>
  )
}

export default YourCampaign