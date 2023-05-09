import { type NextPage } from "next";
import Head from "next/head";
import {
  CrowdFunding,
  CrowdfundCampaigns,
  Hero,
  JoinUs,
  RasingFunds,
} from "~/modules/common/section/home";
// import { CrowdFunding, Hero, RasingFunds } from "~/modules/common/section/home";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Giving Chain</title>
        <meta name="description" content="Giving Chain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <RasingFunds />
      <CrowdfundCampaigns />
      <CrowdFunding />
      <JoinUs />
    </>
  );
};

export default Home;
