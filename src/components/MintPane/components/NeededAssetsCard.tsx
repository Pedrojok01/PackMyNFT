import type { FC } from "react";

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";

interface NeededAssetsCardProps {
  packCount: number;
  selectedNative: NativeCoin | undefined;
  totalNative: number;
  selectedTokens: EvmToken[];
  totalTokens: { [tokenAddress: string]: number };
  selectedCollections: Collection[];
  totalNfts: { [tokenAddress: string]: number };
}

const NeededAssetsCard: FC<NeededAssetsCardProps> = ({
  packCount,
  selectedNative,
  totalNative,
  selectedTokens,
  totalTokens,
  selectedCollections,
  totalNfts,
}) => {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">Total assets needed for {packCount} packs:</Heading>
      </CardHeader>

      <CardBody pt={2}>
        <Stack divider={<StackDivider />} spacing="3">
          {(selectedTokens.length > 0 || selectedNative) && (
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Tokens
              </Heading>
              <Text pt="2" fontSize="sm">
                {selectedNative && (
                  <li>
                    {totalNative} {selectedNative.symbol}
                  </li>
                )}
                {selectedTokens.length > 0 &&
                  Object.entries(totalTokens).map(([tokenAddress, amount], index) => {
                    const token = selectedTokens.find((t) => t.token_address === tokenAddress);
                    return (
                      <li key={index}>
                        {amount} {token?.symbol || "Unknown Token"}
                      </li>
                    );
                  })}
              </Text>
            </Box>
          )}

          {selectedCollections.length > 0 && (
            <Box>
              <Heading size="xs" textTransform="uppercase">
                NFTs
              </Heading>
              <Text pt="2" fontSize="sm">
                {Object.entries(totalNfts).map(([tokenAddress, amount], index) => {
                  const collection = selectedCollections.find(
                    (c) => c.token_address === tokenAddress,
                  );
                  return (
                    <li key={index}>
                      {amount} {collection?.name || "Unknown Collection"}
                    </li>
                  );
                })}
              </Text>
            </Box>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default NeededAssetsCard;
