import type { FC } from "react";

import { Box, Button, Flex, Text } from "@chakra-ui/react";

import { PackAmountInput } from "@/components";
import useStore from "@/store/store";

interface SelectedAssetsProps {
  onRemove?: (assetAddress: string) => void;
  readOnly?: boolean;
}

const SelectedAssets: FC<SelectedAssetsProps> = ({ onRemove, readOnly = false }) => {
  const {
    selectedNative,
    nativeAmount,
    selectedTokens,
    tokenAmounts,
    selectedCollections,
    setNativeAmount,
    setTokenAmount,
  } = useStore();

  const handleNativeAmountChange = (amount: number) => {
    setNativeAmount(amount);
  };

  const handleTokenAmountChange = (amount: number, tokenAddress: string) => {
    setTokenAmount(tokenAddress, amount);
  };

  return (
    <Box>
      {selectedNative && (
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Text>
            {readOnly && nativeAmount} {selectedNative.symbol}
          </Text>
          {!readOnly && onRemove && (
            <Box display={"flex"} justifyContent={"flex-end"} gap={10} alignItems={"center"}>
              <PackAmountInput value={nativeAmount} onChange={handleNativeAmountChange} />

              <Button colorScheme="red" size="sm" onClick={() => onRemove(selectedNative.symbol)}>
                Remove
              </Button>
            </Box>
          )}
        </Flex>
      )}
      {selectedTokens.map((asset) => (
        <Flex key={asset.token_address} justifyContent="space-between" alignItems="center" mb={2}>
          <Text>
            {readOnly && tokenAmounts[asset.token_address]} {asset.name}
          </Text>
          {!readOnly && onRemove && (
            <Box display={"flex"} justifyContent={"flex-end"} gap={10} alignItems={"center"}>
              <PackAmountInput
                value={tokenAmounts[asset.token_address] || ""}
                onChange={(amount) => handleTokenAmountChange(amount, asset.token_address)}
              />

              <Button colorScheme="red" size="sm" onClick={() => onRemove(asset.token_address)}>
                Remove
              </Button>
            </Box>
          )}
        </Flex>
      ))}
      {selectedCollections.map((asset) => (
        <Flex key={asset.token_address} justifyContent="space-between" alignItems="center" mb={2}>
          <Text>{asset.name}</Text>
          {!readOnly && onRemove && (
            <Button colorScheme="red" size="sm" onClick={() => onRemove(asset.token_address)}>
              Remove
            </Button>
          )}
        </Flex>
      ))}
    </Box>
  );
};

export default SelectedAssets;
