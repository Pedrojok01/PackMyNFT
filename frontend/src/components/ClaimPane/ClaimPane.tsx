// components/ClaimPane.tsx
import { type FC } from "react";

import { Button, Flex, VStack, Box, Text } from "@chakra-ui/react";
import { useAccount } from "wagmi";

import { ContentBox, Loading, NotConnected } from "@/components";
import { useContractExecution, useFetchNFTFromCollection } from "@/hooks";
import useStore from "@/store/store";
import styles from "@/styles/mainPane.module.css";

import { DisplayNFTs, SuccessClaim } from "./components";

const ClaimPane: FC = () => {
  const { isConnected, address, chain } = useAccount();
  const { nftToClaim, loading, eventData, setEventData } = useStore();
  const { handleClaim } = useContractExecution();
  const { nfts, isLoading, refetch } = useFetchNFTFromCollection(address ?? "0x", chain?.id ?? 0);

  const claim = async () => {
    setEventData(undefined);
    if (nftToClaim) {
      const receipt = await handleClaim(nftToClaim.token_id);
      if (receipt.success) {
        setEventData(receipt.data.event.args);
        refetch();
      }
    }
  };

  return (
    <ContentBox title="Claim Pack">
      {!isConnected && <NotConnected />}

      {isConnected && isLoading && <Loading />}

      {isConnected && !isLoading && nfts.length === 0 && (
        <Text fontSize="lg" mb={5}>
          You do not have any pack to claim at this time.
        </Text>
      )}

      {!eventData && (
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

      {eventData && <SuccessClaim eventData={eventData} />}
    </ContentBox>
  );
};

export default ClaimPane;
