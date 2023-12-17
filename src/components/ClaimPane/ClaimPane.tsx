// components/ClaimPane.tsx
import { type FC } from "react";

import { Button, Flex, VStack, Box, Text } from "@chakra-ui/react";
import { useAccount, useNetwork } from "wagmi";

import { ContentBox, Loading, NotConnected } from "@/components";
import { useContractExecution, useFetchNFTFromCollection } from "@/hooks";
import useStore from "@/store/store";
import styles from "@/styles/mainPane.module.css";

import { DisplayNFTs } from "./components";

const ClaimPane: FC = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { nftToClaim, loading } = useStore();
  const { handleClaim } = useContractExecution();

  const { nfts, isLoading } = useFetchNFTFromCollection(address ?? "0x", chain?.id ?? 0);

  const claim = () => {
    if (nftToClaim) {
      handleClaim(nftToClaim.token_id);
    }
  };

  return (
    <ContentBox title="Claim Pack">
      {isLoading && <Loading />}
      {!isLoading && nfts.length === 0 && (
        <Text fontSize="lg" mb={5}>
          You do not have any pack to claim at this time.
        </Text>
      )}
      {!isConnected ? (
        <NotConnected />
      ) : (
        <Flex className={styles.content}>
          {isConnected && (
            <VStack spacing={4}>
              <Box flex="1" overflowY="auto" w="full" maxH="500px">
                <DisplayNFTs nfts={nfts} />
              </Box>
              <Button
                colorScheme="teal"
                onClick={claim}
                isDisabled={!nftToClaim}
                isLoading={loading}
              >
                Claim
              </Button>
            </VStack>
          )}
        </Flex>
      )}
    </ContentBox>
  );
};

export default ClaimPane;
