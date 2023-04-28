import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { Campaigns } from "~/modules/common/section/campaign";

const Campaign: NextPage = () => {
    return (
        <>
          <Head>
            <title>Giving Chain | Campaigns</title>
            <meta name="description" content="Giving Chain" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Campaigns />
        </>
      );
};

export default Campaign;
