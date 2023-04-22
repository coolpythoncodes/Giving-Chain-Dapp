import { type AppType } from "next/dist/shared/lib/utils";
import Layout from "~/modules/common/component/layout";
import { Space_Grotesk } from "next/font/google";

import "~/styles/globals.css";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`${space.className} ${space.variable}`}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </main>
  );
};

export default MyApp;
