// components/ReviewAndMintStep.tsx
import { useState, type FC } from "react";

import { Box, Button, Center, HStack, Input, Text } from "@chakra-ui/react";
import Image from "next/image";

import { CustomDivider } from "@/components";
import { useWindowSize } from "@/hooks";
import useStore from "@/store/store";
import { calculateMaxAmountOfPacksMintable } from "@/utils/calculateMaxAmountOfPacksMintable";
import { calculateTotalAssetsRequiredForPacks } from "@/utils/calculateTotalAssetsRequiredForPacks";

import { AssetsPerPack, NeededAssetsCard } from ".";
import packNFT from "../../../../public/img/pack-my-nft.png";

interface ReviewAndMintStepProps {
  onMint: () => void;
}

const ReviewAndMintStep: FC<ReviewAndMintStepProps> = ({ onMint }) => {
  const { isTablet } = useWindowSize();
  const {
    selectedNative,
    nativeAmount,
    selectedTokens,
    tokenAmounts,
    selectedCollections,
    setCurrentStep,
  } = useStore();
  const [packCount, setPackCount] = useState(1);
  const { totalNative, totalTokens, totalNfts } = calculateTotalAssetsRequiredForPacks(
    packCount,
    nativeAmount,
    selectedTokens,
    tokenAmounts,
    selectedCollections,
  );

  const maxPackCount = calculateMaxAmountOfPacksMintable(
    selectedNative,
    nativeAmount,
    selectedTokens,
    tokenAmounts,
    selectedCollections,
  );

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
        {/* Box number 1 */}
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

        {/* Box number 2 */}
        <Box position="relative" w="49%" minW={280}>
          <Text fontSize="lg" mb={4}>
            Number of pack to mint
          </Text>

          <Text fontSize={"sm"} mb="8px">
            Enter the number of pack to mint:{" "}
            <span style={{ color: "red" }}>(max = {maxPackCount})</span>
          </Text>

          <Input
            type="number"
            min={1}
            value={packCount}
            isRequired={true}
            onChange={handlePackCountChange}
          />

          <CustomDivider />

          <NeededAssetsCard
            packCount={packCount}
            selectedNative={selectedNative}
            totalNative={totalNative}
            selectedTokens={selectedTokens}
            totalTokens={totalTokens}
            selectedCollections={selectedCollections}
            totalNfts={totalNfts}
          />
        </Box>
      </HStack>

      <Center gap={10} mt={10} mb={3}>
        <Button onClick={() => setCurrentStep(1)} colorScheme="gray">
          Back
        </Button>
        <Button colorScheme="teal" onClick={onMint}>
          Mint Pack
        </Button>
      </Center>
    </>
  );
};

export default ReviewAndMintStep;
