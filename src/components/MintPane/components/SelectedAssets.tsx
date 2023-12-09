import { useState, type FC } from "react";

import { Box, Button, Divider, Flex, FormErrorMessage, Text } from "@chakra-ui/react";
import { formatUnits } from "viem";

import { PackAmountInput } from "@/components";
import useStore from "@/store/store";

interface SelectedAssetsProps {
  native?: NativeCoin;
  onRemove?: (assetAddress: string) => void;
  readOnly?: boolean;
}

const SelectedAssets: FC<SelectedAssetsProps> = ({ onRemove, readOnly = false, native }) => {
  const {
    selectedNative,
    nativeAmount,
    selectedTokens,
    tokenAmounts,
    selectedCollections,
    setNativeAmount,
    setTokenAmount,
  } = useStore();
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const handleAmountChange = (amount: number, assetAddress?: string) => {
    setErrors({ ...errors, [assetAddress || "native"]: amount <= 0 || isNaN(amount) });
    if (assetAddress) {
      setTokenAmount(assetAddress, amount);
    } else {
      setNativeAmount(amount);
    }
  };

  return (
    <Box>
      {!readOnly &&
        native &&
        (selectedNative || selectedTokens.length > 0 || selectedCollections.length > 0) && (
          <>
            <Text fontSize="1rem" mt={4} mb={4}>
              For {native.symbol} and ERC20 tokens, enter the amount to add per pack
            </Text>
            <Divider my={5} />
          </>
        )}

      {selectedNative && (
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Text>
            {readOnly && nativeAmount} {selectedNative.symbol}
          </Text>
          {!readOnly && onRemove && (
            <Box display={"flex"} justifyContent={"flex-end"} gap={10} alignItems={"center"}>
              <PackAmountInput
                balance={selectedNative.formatted}
                value={nativeAmount}
                onChange={(amount) => handleAmountChange(amount)}
              />
              {errors["native"] && <FormErrorMessage>Invalid amount</FormErrorMessage>}

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
                balance={formatUnits(BigInt(asset.balance), Number(asset.decimals))}
                value={tokenAmounts[asset.token_address] || ""}
                onChange={(amount) => handleAmountChange(amount, asset.token_address)}
              />
              {errors["native"] && <FormErrorMessage>Invalid amount</FormErrorMessage>}

              <Button colorScheme="red" size="sm" onClick={() => onRemove(asset.token_address)}>
                Remove
              </Button>
            </Box>
          )}
        </Flex>
      ))}
      {selectedCollections.map((asset) => (
        <Flex key={asset.token_address} justifyContent="space-between" alignItems="center" mb={2}>
          <Text>
            {readOnly && "1"} {asset.name}
          </Text>
          {!readOnly && onRemove && (
            <Button colorScheme="red" size="sm" onClick={() => onRemove(asset.token_address)}>
              Remove
            </Button>
          )}
        </Flex>
      ))}
      {!readOnly &&
        (selectedNative || selectedTokens.length > 0 || selectedCollections.length > 0) && (
          <Divider my={5} />
        )}
    </Box>
  );
};

export default SelectedAssets;
