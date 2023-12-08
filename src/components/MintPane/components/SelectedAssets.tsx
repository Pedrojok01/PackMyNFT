import type { FC } from "react";

import { Box, Button, Flex, Text } from "@chakra-ui/react";

import useStore from "@/store/store";

interface SelectedAssetsProps {
  onRemove?: (assetAddress: string) => void;
  readOnly?: boolean;
}

const SelectedAssets: FC<SelectedAssetsProps> = ({ onRemove, readOnly = false }) => {
  const { selectedNative, selectedTokens, selectedCollections } = useStore();

  return (
    <Box>
      {selectedNative && (
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Text>{selectedNative.symbol}</Text>
          {!readOnly && onRemove && (
            <Button colorScheme="red" size="sm" onClick={() => onRemove(selectedNative.symbol)}>
              Remove
            </Button>
          )}
        </Flex>
      )}
      {selectedTokens.map((asset) => (
        <Flex key={asset.token_address} justifyContent="space-between" alignItems="center" mb={2}>
          <Text>{asset.name}</Text>
          {!readOnly && onRemove && (
            <Button colorScheme="red" size="sm" onClick={() => onRemove(asset.token_address)}>
              Remove
            </Button>
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
