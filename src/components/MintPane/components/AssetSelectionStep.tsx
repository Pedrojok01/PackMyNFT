// components/AssetSelectionStep.tsx
import { type FC, useMemo } from "react";

import { Button, Text, useToast } from "@chakra-ui/react";
import { useAccount, useBalance, useNetwork } from "wagmi";

import { MAX_ASSETS_PER_PACK } from "@/data/constant";
import { useFetchTokenBalances, useFetchWalletNFTCollections } from "@/hooks";
import useStore from "@/store/store";

import CollectionSelect from "./CollectionSelect";
import SelectedAssets from "./SelectedAssets";
import TokenSelect from "./TokenSelect";

const AssetSelectionStep: FC = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: nativeData } = useBalance({ address, watch: true });
  const toast = useToast();

  if (!address || !chain?.id || !nativeData) {
    throw new Error("Address, Chain Id, or Native Data is missing");
  }

  const { tokens } = useFetchTokenBalances(address, chain.id);
  const { collections } = useFetchWalletNFTCollections(address, chain.id);

  const {
    selectedNative,
    selectedTokens,
    selectedCollections,
    setSelectedNative,
    setSelectedTokens,
    setSelectedCollections,
    setCurrentStep,
  } = useStore();

  const combinedAssetCount = useMemo(() => {
    const nativeCount = selectedNative ? 1 : 0;
    return nativeCount + selectedTokens.length + selectedCollections.length;
  }, [selectedNative, selectedTokens, selectedCollections]);

  const updateSelectedAssets = (selectedAsset: EvmToken | NativeCoin) => {
    if (combinedAssetCount >= MAX_ASSETS_PER_PACK) {
      displayToast("Asset limit reached");
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
      displayToast("Asset limit reached");
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
      displayToast("Asset limit exceeded");
    }
  };

  const handleRemoveAsset = (assetAddress: string) => {
    setSelectedNative(selectedNative?.symbol === assetAddress ? undefined : selectedNative);
    setSelectedTokens(selectedTokens.filter((token) => token.token_address !== assetAddress));
    setSelectedCollections(
      selectedCollections.filter((collection) => collection.token_address !== assetAddress),
    );
  };

  const proceedToNextStep = () => {
    if (combinedAssetCount <= MAX_ASSETS_PER_PACK) {
      setCurrentStep(2);
    } else {
      displayToast("Asset limit exceeded");
    }
  };

  const displayToast = (message: string) => {
    toast({
      title: message,
      description: `You can only add up to ${MAX_ASSETS_PER_PACK} assets per pack.`,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Text fontSize="lg" mb={4}>
        Choose the assets to add to your pack
      </Text>

      <TokenSelect native={nativeData} tokens={tokens} onChange={updateSelectedAssets} />
      <CollectionSelect collections={collections} onChange={updateSelectedCollections} />
      <SelectedAssets onRemove={handleRemoveAsset} />
      <Button onClick={proceedToNextStep} colorScheme="teal">
        Next
      </Button>
    </>
  );
};

export default AssetSelectionStep;
