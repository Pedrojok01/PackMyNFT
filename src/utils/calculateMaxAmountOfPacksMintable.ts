// utils/calculateMaxAmountOfPacksMintable.ts
import { formatTokenBalance } from "./formatters";

export const calculateMaxAmountOfPacksMintable = (
  selectedNative: NativeCoin | undefined,
  nativeAmount: string | undefined, // Amount of native token per pack
  selectedTokens: EvmToken[],
  tokenAmounts: Record<string, string>, // Amounts of each token per pack
  selectedCollections: Collections,
): number => {
  let maxPacks = 10_000;

  // Check for native coin
  if (
    selectedNative &&
    Number(nativeAmount) &&
    Number(selectedNative.formatted) > 0 &&
    Number(nativeAmount) > 0
  ) {
    const nativeMaxPacks = Number(selectedNative.formatted) / Number(nativeAmount);
    maxPacks = Math.min(maxPacks, Math.floor(nativeMaxPacks));
  }

  // Check for each token
  selectedTokens?.forEach((token) => {
    if (Number(tokenAmounts[token.token_address]) > 0 && Number(token.balance) > 0) {
      const tokenMaxPacks =
        Number(formatTokenBalance(token)) / Number(tokenAmounts[token.token_address]);
      maxPacks = Math.min(maxPacks, Math.floor(tokenMaxPacks));
    }
  });

  // Check for collections (considering the total number of NFTs in each collection)
  selectedCollections.forEach((collection) => {
    if (collection.total > 0) {
      maxPacks = Math.min(maxPacks, collection.total);
    }
  });

  return isFinite(maxPacks) && maxPacks > 0 ? maxPacks : 0;
};
