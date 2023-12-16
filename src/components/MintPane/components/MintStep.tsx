// components/ReviewAndMintStep.tsx
import { type FC } from "react";

import { Box, Button, Center, HStack, Input, Text } from "@chakra-ui/react";
import Image from "next/image";

import { CustomDivider } from "@/components";
import { useMintingProcess, useTotalAssetsRequiredPerPack, useWindowSize } from "@/hooks";
import useStore from "@/store/store";

import { AssetsPerPack, MintProgressModal, NeededAssetsCard } from ".";
import packNFT from "../../../../public/img/pack-my-nft.png";

const ReviewAndMintStep: FC = () => {
  const { isTablet } = useWindowSize();
  const { loading, setPackCount, setCurrentStep } = useStore();
  const { totalNative, totalTokens, totalNfts } = useTotalAssetsRequiredPerPack();
  const {
    handleMint,
    isMintModalOpen,
    setMintModalOpen,
    currentMintStep,
    batchProgress,
    maxPackCount,
    packCount,
  } = useMintingProcess();

  const handlePackCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPackCount = Math.max(1, Math.min(maxPackCount, Number(e.target.value)));
    setPackCount(newPackCount);
  };

  return (
    <>
      <HStack
        alignItems={!isTablet ? "flex-start" : "center"}
        justifyContent="center"
        flexDirection={!isTablet ? "row" : "column"}
      >
        <Box position="relative" w="49%" minW={300}>
          <Text fontSize="lg" mb={4}>
            Pack content preview
          </Text>
          <Box
            position={"absolute"}
            w={"100%"}
            h={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <AssetsPerPack />
          </Box>
          <Image
            src={packNFT.src}
            alt="Pack My NFT"
            width={400}
            height={400}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Box>

        <Box position="relative" w="49%" minW={280}>
          <Text fontSize="lg" mb={4}>
            Number of pack to mint
          </Text>

          <Text fontSize={"sm"} mb="8px">
            Enter the number of pack to mint:{" "}
            <span style={{ color: "red" }}>(max = {maxPackCount})</span>
          </Text>

          <Input type="number" min={1} value={packCount} onChange={handlePackCountChange} />

          <CustomDivider />

          <NeededAssetsCard
            packCount={packCount}
            totalNative={totalNative}
            totalTokens={totalTokens}
            totalNfts={totalNfts}
          />
        </Box>
      </HStack>

      <Center gap={10} mt={10} mb={3}>
        <Button onClick={() => setCurrentStep(1)} colorScheme="gray">
          Back
        </Button>
        <Button colorScheme="teal" onClick={handleMint} isLoading={loading}>
          Mint Pack
        </Button>
      </Center>

      <MintProgressModal
        isOpen={isMintModalOpen}
        onClose={() => setMintModalOpen(false)}
        currentStep={currentMintStep}
        batchProgress={batchProgress}
      />
    </>
  );
};

export default ReviewAndMintStep;
