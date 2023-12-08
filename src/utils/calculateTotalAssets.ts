// utils.js
export const calculateTotalAssets = (
  selectedNative: NativeCoin | undefined,
  selectedTokens: EvmToken[],
  selectedCollections: Collection[],
  packCount: number,
) => {
  const totalNative = selectedNative ? BigInt(selectedNative.value) * BigInt(packCount) : BigInt(0);
  const totalTokens = selectedTokens.reduce(
    (sum, token) => sum + BigInt(token.balance) * BigInt(packCount),
    BigInt(0),
  );
  const totalNfts = selectedCollections.length * packCount;

  return {
    totalNative: totalNative.toString(), // Convert BigInt back to string for display
    totalTokens: totalTokens.toString(),
    totalNfts,
  };
};
