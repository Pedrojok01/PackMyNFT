// components/AssetSelectionStep.tsx
import { type FC } from "react";

import { Button, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useAccount, useBalance, useNetwork } from "wagmi";

import { useAssetUpdater, useFetchTokenBalances, useFetchWalletNFTs, useNotify } from "@/hooks";
import useStore from "@/store/store";

import CollectionSelect from "./CollectionSelect";
import SelectedAssets from "./SelectedAssets";
import TokenSelect from "./TokenSelect";

const AssetSelectionStep: FC = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: nativeData } = useBalance({ address, watch: true });
  const { notifyError } = useNotify();
  const { setCurrentStep } = useStore();

  const isDataLoaded = address && chain?.id && nativeData;

  const {
    combinedAssetCount,
    isAmountMissing,
    updateSelectedAssets,
    updateSelectedCollections,
    handleRemoveAsset,
  } = useAssetUpdater();
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

  if (!isDataLoaded) {
    return (
      <Center>
        <VStack spacing={4}>
          <Spinner />
          <Text>Fetching data... Please wait.</Text>
        </VStack>
      </Center>
    );
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

export default AssetSelectionStep;
