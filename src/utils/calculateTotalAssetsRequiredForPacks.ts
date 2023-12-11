interface TotalAssetsRequired {
  totalNative: number;
  totalTokens: Record<string, number>;
  totalNfts: Record<string, number>;
}

export const calculateTotalAssetsRequiredForPacks = (
  packCount: number,
  nativeAmount: number | undefined,
  selectedTokens: EvmToken[],
  tokenAmounts: Record<string, number>,
  selectedCollections: CollectionExtended[],
): TotalAssetsRequired => {
  let totalNative = 0;
  const totalTokens: Record<string, number> = {};
  const totalNfts: Record<string, number> = {};

  // Calculate total native coins required
  if (nativeAmount) {
    totalNative = packCount * nativeAmount;
  }

  // Calculate total tokens required for each token
  selectedTokens.forEach((token) => {
    const amountPerPack = tokenAmounts[token.token_address] || 0;
    totalTokens[token.token_address] = packCount * amountPerPack;
  });

  // Calculate total NFTs required for each collection
  selectedCollections.forEach((collection) => {
    // Assuming one NFT per pack per collection
    totalNfts[collection.token_address] = packCount;
  });

  return { totalNative, totalTokens, totalNfts };
};
