// components/AssetSelectionStep.tsx
import { type FC } from "react";

import { Button, Text } from "@chakra-ui/react";
import { useAccount, useBalance, useNetwork } from "wagmi";

import {
  useAssetUpdater,
  useFetchTokenBalances,
  useFetchWalletNFTCollections,
  useNotify,
} from "@/hooks";
import useStore from "@/store/store";

import CollectionSelect from "./CollectionSelect";
import SelectedAssets from "./SelectedAssets";
import TokenSelect from "./TokenSelect";

const AssetSelectionStep: FC = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: nativeData } = useBalance({ address, watch: true });
  const { notifyError } = useNotify();

  if (!address || !chain?.id || !nativeData) {
    throw new Error("Missing required data. Reconnect your web3 wallet.");
  }

  const { combinedAssetCount, updateSelectedAssets, updateSelectedCollections, handleRemoveAsset } =
    useAssetUpdater();
  const { tokens } = useFetchTokenBalances(address, chain.id);
  const { collections } = useFetchWalletNFTCollections(address, chain.id);

  const { selectedNative, nativeAmount, selectedTokens, tokenAmounts, setCurrentStep } = useStore();

  const isAmountMissing = () => {
    if (selectedNative && !nativeAmount) return true;
    return selectedTokens.some((token) => !tokenAmounts[token.token_address]);
  };

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

  return (
    <>
      <Text fontSize="lg" mb={4}>
        Choose the assets to add to your pack
      </Text>

      <TokenSelect native={nativeData} tokens={tokens} onChange={updateSelectedAssets} />
      <CollectionSelect collections={collections} onChange={updateSelectedCollections} />
      <SelectedAssets onRemove={handleRemoveAsset} />
      <Button onClick={proceedToNextStep} colorScheme="teal" isDisabled={combinedAssetCount === 0}>
        Next
      </Button>
    </>
  );
};

export default AssetSelectionStep;
