import { type FC } from "react";

import { Box, Button, Flex, Text } from "@chakra-ui/react";

import { CustomDivider, PackAmountInput } from "@/components";
import { useWindowSize } from "@/hooks";
import useStore from "@/store/store";
import { formatTokenBalance } from "@/utils";

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

  const handleAmountChange = (amount: string, assetAddress?: string) => {
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
              value={nativeAmount ?? ""}
              balance={selectedNative.formatted}
              onAmountChange={(amount) => handleAmountChange(amount.toString())}
            />
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
              value={tokenAmounts[asset.token_address] ?? ""}
              balance={formatTokenBalance(asset)}
              onAmountChange={(amount) =>
                handleAmountChange(amount.toString(), asset.token_address)
              }
            />

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
