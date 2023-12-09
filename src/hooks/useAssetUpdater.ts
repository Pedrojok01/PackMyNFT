// hooks/useAssetUpdater.js

import { useMemo } from "react";

import { MAX_ASSETS_PER_PACK } from "@/data/constant";
import useStore from "@/store/store";

import { useNotify } from ".";

export const useAssetUpdater = () => {
  const { notifyError } = useNotify();
  const {
    selectedNative,
    selectedTokens,
    selectedCollections,
    setSelectedNative,
    setSelectedTokens,
    setSelectedCollections,
  } = useStore();

  const title = "Asset limit exceeded";
  const message = `You can only add up to ${MAX_ASSETS_PER_PACK} assets per pack.`;

  const combinedAssetCount = useMemo(() => {
    const nativeCount = selectedNative ? 1 : 0;
    return nativeCount + selectedTokens.length + selectedCollections.length;
  }, [selectedNative, selectedTokens, selectedCollections]);

  const updateSelectedAssets = (selectedAsset: EvmToken | NativeCoin) => {
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
  };

  const updateSelectedCollections = (newCollection: Collection) => {
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
  };

  const handleRemoveAsset = (assetAddress: string) => {
    setSelectedNative(selectedNative?.symbol === assetAddress ? undefined : selectedNative);
    setSelectedTokens(selectedTokens.filter((token) => token.token_address !== assetAddress));
    setSelectedCollections(
      selectedCollections.filter((collection) => collection.token_address !== assetAddress),
    );
  };

  return { combinedAssetCount, updateSelectedAssets, updateSelectedCollections, handleRemoveAsset };
};
