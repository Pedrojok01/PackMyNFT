import { parseEther } from "viem";

import { parseTokenBalance } from ".";

interface TotalAssetsRequired {
  totalNative: string;
  totalTokens: Record<string, string>;
  totalNfts: Record<string, number>;
}

export const calculateTotalAssetsRequiredForPacks = (
  packCount: number,
  nativeAmount: string | undefined,
  selectedTokens: EvmToken[],
  tokenAmounts: Record<string, string>,
  selectedCollections: CollectionExtended[],
): TotalAssetsRequired => {
  let totalNative = "0";
  const totalTokens: Record<string, string> = {};
  const totalNfts: Record<string, number> = {};

  // Calculate total native coins required
  if (nativeAmount) {
    totalNative = (parseEther(nativeAmount) * BigInt(packCount)).toString();
  }

  // Calculate total tokens required for each token
  selectedTokens.forEach((token) => {
    const amountPerPack = tokenAmounts[token.token_address] || "0";
    totalTokens[token.token_address] = (
      BigInt(packCount) * parseTokenBalance(Number(amountPerPack), token.decimals)
    ).toString();
  });

  // Calculate total NFTs required for each collection
  selectedCollections.forEach((collection) => {
    // Assuming one NFT per pack per collection
    totalNfts[collection.token_address] = packCount;
  });

  return { totalNative, totalTokens, totalNfts };
};
