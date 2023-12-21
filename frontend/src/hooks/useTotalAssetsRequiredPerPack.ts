import useStore from "@/store/store";
import { calculateTotalAssetsRequiredForPacks } from "@/utils";

export const useTotalAssetsRequiredPerPack = () => {
  const { nativeAmount, selectedTokens, tokenAmounts, selectedCollections, packCount } = useStore();

  const { totalNative, totalTokens, totalNfts } = calculateTotalAssetsRequiredForPacks(
    packCount,
    nativeAmount,
    selectedTokens,
    tokenAmounts,
    selectedCollections,
  );

  return { totalNative, totalTokens, totalNfts };
};
