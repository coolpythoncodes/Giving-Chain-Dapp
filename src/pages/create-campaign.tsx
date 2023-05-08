import React from "react";
import { type NextPage } from "next";
import Head from "next/head";

import { CampaignForm } from "~/modules/common/section/create-campaign";

const CreateCampaign: NextPage = () => {
  return (
    <>
      <Head>
        <title>Giving Chain | Create Campaign</title>
        <meta name="description" content="Giving Chain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CampaignForm />
    </>
  );
};

export default CreateCampaign;
