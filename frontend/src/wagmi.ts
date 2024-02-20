import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import type { Transport } from "viem";
import { createConfig, http } from "wagmi";
import {
  mainnet,
  sepolia,
  polygon,
  polygonMumbai,
  optimism,
  arbitrum,
  fantom,
  bsc,
  bscTestnet,
} from "wagmi/chains";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!walletConnectProjectId) {
  throw new Error("Some ENV variables are not defined");
}

const connectors = connectorsForWallets(
  [
    {
      groupName: "Other",
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
        ledgerWallet,
        rabbyWallet,
        coinbaseWallet,
        argentWallet,
        safeWallet,
      ],
    },
  ],
  { appName: "PackMyNFT", projectId: walletConnectProjectId },
);

const transports: Record<number, Transport> =
  process.env.NEXT_PUBLIC_NODE_ENV === "production"
    ? {
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [optimism.id]: http(),
        [arbitrum.id]: http(),
        [fantom.id]: http(),
        [bsc.id]: http(),
      }
    : {
        [sepolia.id]: http(),
        [polygonMumbai.id]: http(),
        // [optimismGoerli.id]: http(),
        // [arbitrumGoerli.id]: http(),
        // [fantomTestnet.id]: http(),
        [bscTestnet.id]: http(),
      };

export const config = createConfig({
  chains:
    process.env.NEXT_PUBLIC_NODE_ENV === "production"
      ? [mainnet, optimism, polygon, arbitrum, fantom, bsc]
      : [sepolia, polygonMumbai, bscTestnet],
  connectors,
  transports,
});
