// components/ClaimPane.tsx
import { type FC } from "react";

import { Button, Flex, Center } from "@chakra-ui/react";
import { useAccount, useNetwork } from "wagmi";

import { ContentBox, Loading, NotConnected } from "@/components";
import { useFetchNFTFromCollection } from "@/hooks";
import useStore from "@/store/store";
import styles from "@/styles/mainPane.module.css";

import { DisplayNFTs } from "./components";

const ClaimPane: FC = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { nftToClaim } = useStore();

  if (!address) {
    throw new Error("Address not found. Make sure that your web3 wallet is connected.");
  }

  const isDataLoaded = address && chain?.id;
  const { nfts } = useFetchNFTFromCollection(address, chain?.id ?? 0);

  if (!isDataLoaded || !address) {
    return <Loading />;
  }

  const handleClaim = () => {
    if (nftToClaim) {
      console.log("Claiming NFT with Token ID:", nftToClaim.token_id);
      // Implement claim logic here
    }
  };

  return (
    <ContentBox title="Claim Pack">
      {!isConnected ? (
        <NotConnected />
      ) : (
        <Flex className={styles.content}>
          {isConnected && (
            <>
              <DisplayNFTs nfts={nfts} />

              <Center justifyContent="center" mt={6}>
                <Button colorScheme="teal" onClick={handleClaim}>
                  Claim
                </Button>
              </Center>
            </>
          )}
        </Flex>
      )}
    </ContentBox>
  );
};

export default ClaimPane;
