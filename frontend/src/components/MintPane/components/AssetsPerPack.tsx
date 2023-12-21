import { type FC } from "react";

import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";

import useStore from "@/store/store";
import { trimDecimals } from "@/utils";

const AssetsPerPack: FC = () => {
  const { colorMode } = useColorMode();
  const { selectedNative, nativeAmount, selectedTokens, tokenAmounts, selectedCollections } =
    useStore();

  const backgroundColor =
    colorMode === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(26, 32, 44, 0.8)";

  const renderAssets = (amount: string, name: string, index: number) => (
    <Flex key={index} justifyContent="space-between" alignItems="center" mb={2}>
      <Text>
        {amount} {name}
      </Text>
    </Flex>
  );

  return (
    <Box bg={backgroundColor} p={2} borderRadius={8}>
      {selectedNative &&
        nativeAmount &&
        renderAssets(
          trimDecimals(Number(nativeAmount).toFixed(9).toString()),
          selectedNative.symbol,
          Number(nativeAmount),
        )}
      {selectedTokens.map((asset, index) =>
        renderAssets(tokenAmounts[asset.token_address], asset.name, index),
      )}
      {selectedCollections.map((asset, index) => renderAssets("1", asset.name, index))}
    </Box>
  );
};

export default AssetsPerPack;
