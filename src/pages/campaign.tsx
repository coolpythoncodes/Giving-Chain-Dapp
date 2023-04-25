import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { YourCampaign } from "~/modules/common/section/campaign";

const Campaign: NextPage = () => {
  return (
    <>
      <Head>
        <title>Giving Chain | Campaign</title>
        <meta name="description" content="Giving Chain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <YourCampaign />
    </>
  )
}

export default Campaign