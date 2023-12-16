// hooks/useAssetUpdater.ts
import { useCallback } from "react";

import { MAX_ASSETS_PER_PACK } from "@/data/constant";
import useStore from "@/store/store";

import { useNotify } from ".";

export const useAssetUpdater = () => {
  const { notifyError } = useNotify();
  const {
    selectedNative,
    nativeAmount,
    selectedTokens,
    tokenAmounts,
    selectedCollections,
    setSelectedNative,
    setNativeAmount,
    setSelectedTokens,
    setTokenAmount,
    setSelectedCollections,
  } = useStore();

  const title = "Asset limit exceeded";
  const message = `You can only add up to ${MAX_ASSETS_PER_PACK} assets per pack.`;

  const combinedAssetCount = selectedNative
    ? 1
    : 0 + selectedTokens.length + selectedCollections.length;

  const isAmountMissing = () => {
    if (selectedNative && !nativeAmount) return true;
    return selectedTokens.some((token) => !tokenAmounts[token.token_address]);
  };

  const updateSelectedAssets = useCallback(
    (selectedAsset: EvmToken | NativeCoin) => {
      if (combinedAssetCount >= MAX_ASSETS_PER_PACK) {
        notifyError({ title, message });
        return;
      }

      if ("token_address" in selectedAsset) {
        const newTokens = selectedTokens.some(
          (token) => token.token_address === selectedAsset.token_address,
        )
          ? selectedTokens.filter((token) => token.token_address !== selectedAsset.token_address)
          : [...selectedTokens, selectedAsset];
        setSelectedTokens(newTokens);
      } else {
        setSelectedNative(
          selectedAsset.symbol === selectedNative?.symbol ? undefined : selectedAsset,
        );
      }
    },
    [
      combinedAssetCount,
      selectedTokens,
      setSelectedTokens,
      selectedNative,
      setSelectedNative,
      message,
      notifyError,
    ],
  );

  const updateSelectedCollections = useCallback(
    (newCollection: CollectionExtended) => {
      if (combinedAssetCount >= MAX_ASSETS_PER_PACK) {
        notifyError({ title, message });
        return;
      }

      if (
        selectedCollections.find(
          (collection) => collection.token_address === newCollection.token_address,
        )
      ) {
        setSelectedCollections(
          selectedCollections.filter(
            (collection) => collection.token_address !== newCollection.token_address,
          ),
        );
      } else if (combinedAssetCount < MAX_ASSETS_PER_PACK) {
        setSelectedCollections([...selectedCollections, newCollection]);
      } else {
        notifyError({ title, message });
      }
    },
    [combinedAssetCount, message, selectedCollections, setSelectedCollections, notifyError],
  );

  const handleRemoveAsset = useCallback(
    (assetAddress: string) => {
      setSelectedNative(selectedNative?.symbol === assetAddress ? undefined : selectedNative);
      setNativeAmount(selectedNative?.symbol === assetAddress ? undefined : nativeAmount);
      setSelectedTokens(selectedTokens.filter((token) => token.token_address !== assetAddress));
      setTokenAmount(assetAddress, 0);
      setSelectedCollections(
        selectedCollections.filter((collection) => collection.token_address !== assetAddress),
      );
    },
    [
      nativeAmount,
      setNativeAmount,
      setSelectedCollections,
      setSelectedNative,
      setSelectedTokens,
      setTokenAmount,
      selectedNative,
      selectedTokens,
      selectedCollections,
    ],
  );

  return {
    combinedAssetCount,
    isAmountMissing,
    updateSelectedAssets,
    updateSelectedCollections,
    handleRemoveAsset,
  };
};
