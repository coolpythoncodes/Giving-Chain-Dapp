import { useEffect, useState } from "react";
import { evmWallets } from "@particle-network/connect";
import { ModalProvider } from "@particle-network/connect-react-ui";
import { WalletEntryPosition } from "@particle-network/auth";
import { BSCTestnet } from "@particle-network/common";
import "@particle-network/connect-react-ui/esm/index.css";
import { type AppType } from "next/dist/shared/lib/utils";
import Layout from "~/modules/common/component/layout";
import { Space_Grotesk } from "next/font/google";
// import { WagmiConfig, createClient } from "wagmi";

import "~/styles/globals.css";
// import { localhost } from "@wagmi/chains";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

const MyApp: AppType = ({ Component, pageProps }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // const provider = useParticleProvider();

  // const wagmiClient = createClient({
  //   autoConnect: true,
  //   provider,
  // });

  // const chains = [localhost]

  // const ethereumClient = new EthereumClient(wagmiClient, chains);

  return (
    <ModalProvider
      walletSort={["Particle Auth", "Wallet"]}
      particleAuthSort={[
        "email",
        "phone",
        "google",
        "apple",
        "facebook",
        "microsoft",
        "linkedin",
        "github",
        "discord",
      ]}
      options={{
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
        clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY as string,
        appId: process.env.NEXT_PUBLIC_APP_ID as string,
        chains: [BSCTestnet],
        particleWalletEntry: {
          displayWalletEntry: true,
          defaultWalletEntryPosition: WalletEntryPosition.BR,
          supportChains: [BSCTestnet],
        },
        wallets: [...evmWallets({ qrcode: false })],
      }}
      language="en"
      theme={"auto"}
    >
      {/* <WagmiConfig client={wagmiClient}> */}
      {mounted ? (
        <main className={`${space.className} ${space.variable}`}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </main>
      ) : null}
      {/* </WagmiConfig> */}
    </ModalProvider>
  );
};

export default MyApp;
