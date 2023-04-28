import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { IndividualCampaign } from "~/modules/common/section/individual-campaign";

const CampaignId: NextPage = () => {
    return (
        <>
          <Head>
            <title>Giving Chain | Campaign</title>
            <meta name="description" content="Giving Chain" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <IndividualCampaign />
        </>
      );
};

export default CampaignId;
