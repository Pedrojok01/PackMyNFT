import { useState, type FC } from "react";

import { Box, Button, Divider, Flex, FormErrorMessage, Text } from "@chakra-ui/react";
import { formatUnits } from "viem";

import { PackAmountInput } from "@/components";
import { useWindowSize } from "@/hooks";
import useStore from "@/store/store";

interface SelectedAssetsProps {
  native: NativeCoin;
  onRemove: (assetAddress: string) => void;
}

const SelectedAssets: FC<SelectedAssetsProps> = ({ onRemove, native }) => {
  const { isMobile } = useWindowSize();
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
    assetAddress ? setTokenAmount(assetAddress, amount) : setNativeAmount(amount);
  };

  const RemoveButton = ({ asset }: { asset: string }) => (
    <Button colorScheme="red" size="sm" onClick={() => onRemove(asset)}>
      Remove
    </Button>
  );

  const SelectAmountWarning = () => (
    <>
      {(selectedNative || selectedTokens.length > 0) && (
        <Text fontSize="0.8rem" mt={4} mb={4} textAlign={"left"} color={"red"}>
          * For {native.symbol} and tokens, enter the amount to add per pack
        </Text>
      )}
    </>
  );

  return (
    <Box>
      {(selectedNative || selectedTokens.length > 0 || selectedCollections.length > 0) && (
        <CustomDivider />
      )}

      {selectedNative && (
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Text>
            {selectedNative.symbol}{" "}
            {!isMobile && <span style={{ fontSize: "11px" }}>(native) </span>}
            <span style={{ color: "red" }}>*</span>
          </Text>

          <Box display={"flex"} justifyContent={"flex-end"} gap={10} alignItems={"center"}>
            <PackAmountInput
              balance={selectedNative.formatted}
              value={nativeAmount}
              onChange={(amount) => handleAmountChange(amount)}
            />
            {errors["native"] && <FormErrorMessage>Invalid amount</FormErrorMessage>}

            <RemoveButton asset={selectedNative.symbol} />
          </Box>
        </Flex>
      )}

      {selectedTokens.map((asset) => (
        <Flex key={asset.token_address} justifyContent="space-between" alignItems="center" mb={2}>
          <Text>
            {asset.name} {!isMobile && <span style={{ fontSize: "11px" }}>(token) </span>}
            <span style={{ color: "red" }}>*</span>
          </Text>

          <Box display={"flex"} justifyContent={"flex-end"} gap={10} alignItems={"center"}>
            <PackAmountInput
              balance={formatUnits(BigInt(asset.balance), Number(asset.decimals))}
              value={tokenAmounts[asset.token_address] || ""}
              onChange={(amount) => handleAmountChange(amount, asset.token_address)}
            />
            {errors["native"] && <FormErrorMessage>Invalid amount</FormErrorMessage>}

            <RemoveButton asset={asset.token_address} />
          </Box>
        </Flex>
      ))}

      {selectedCollections.map((asset) => (
        <Flex key={asset.token_address} justifyContent="space-between" alignItems="center" mb={2}>
          <Text>
            {asset.name} {!isMobile && <span style={{ fontSize: "11px" }}>(nft)</span>}
          </Text>

          <RemoveButton asset={asset.token_address} />
        </Flex>
      ))}

      {(selectedNative || selectedTokens.length > 0 || selectedCollections.length > 0) && (
        <CustomDivider />
      )}
      <SelectAmountWarning />
    </Box>
  );
};

export default SelectedAssets;

const CustomDivider: FC = () => (
  <>
    <Divider mt={5} mb={1} />
    <Divider mt={1} mb={5} />
  </>
);
