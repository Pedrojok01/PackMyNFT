"use client";
import { useAccount, useNetwork } from "wagmi";

import { MintPane } from "@/components";
import CustomLayout from "@/components/CustomLayout";
// import { useFetchTokenBalances, useFetchWalletNFTCollections, useFetchWalletNFTs } from "@/hooks";
import { useFetchWalletNFTCollections } from "@/hooks";

export default function Mint() {
  const { address } = useAccount();
  const { chain } = useNetwork();

  if (!address || !chain?.id) {
    throw new Error("No address or chain id");
  }

  // const { tokens, isError, isLoading } = useFetchTokenBalances(address, chain.id);
  // const { nfts, isError, isLoading } = useFetchWalletNFTs(address, chain.id);
  const { collections, isError, isLoading } = useFetchWalletNFTCollections(address, chain.id);

  console.log({ collections, isError, isLoading });

  return (
    <CustomLayout>
      <MintPane />
    </CustomLayout>
  );
}
