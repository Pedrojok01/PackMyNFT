// components/AssetSelectionStep.tsx
import { type FC } from "react";

import { Button, Text } from "@chakra-ui/react";
import { useAccount, useBalance, useNetwork } from "wagmi";

import { Loading } from "@/components";
import { useAssetUpdater, useFetchTokenBalances, useFetchWalletNFTs, useNotify } from "@/hooks";
import useStore from "@/store/store";

import CollectionSelect from "./CollectionSelect";
import SelectedAssets from "./SelectedAssets";
import TokenSelect from "./TokenSelect";

const SelectStep: FC = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: nativeData } = useBalance({ address, watch: true });
  const { notifyError } = useNotify();
  const { setCurrentStep } = useStore();
  const {
    combinedAssetCount,
    isAmountMissing,
    updateSelectedAssets,
    updateSelectedCollections,
    handleRemoveAsset,
  } = useAssetUpdater();

  if (!address) {
    throw new Error("Address not found. Make sure that your web3 wallet is connected.");
  }

  const isDataLoaded = address && chain?.id && nativeData;

  const { tokens } = useFetchTokenBalances(address, chain?.id ?? 0);
  const { collections } = useFetchWalletNFTs(address, chain?.id ?? 0);

  const proceedToNextStep = () => {
    if (isAmountMissing()) {
      notifyError({
        title: "Error",
        message: "Please enter all required amounts before proceeding.",
      });
      return;
    }

    setCurrentStep(2);
  };

  if (!isDataLoaded || !address) {
    return <Loading />;
  }

  return (
    <>
      <Text fontSize="lg" mb={4}>
        Choose the assets to add to your pack
      </Text>

      <TokenSelect native={nativeData} tokens={tokens} onChange={updateSelectedAssets} />
      <CollectionSelect collections={collections} onChange={updateSelectedCollections} />
      <SelectedAssets onRemove={handleRemoveAsset} native={nativeData} />
      <Button onClick={proceedToNextStep} colorScheme="teal" isDisabled={combinedAssetCount === 0}>
        Next
      </Button>
    </>
  );
};

export default SelectStep;
