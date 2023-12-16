// components/ReviewAndMintStep.tsx
import { useState, type FC } from "react";

import { Box, Button, Center, HStack, Input, Text } from "@chakra-ui/react";
import Image from "next/image";

import { CustomDivider } from "@/components";
import { useContractExecution, useWindowSize } from "@/hooks";
import useStore from "@/store/store";
import {
  calculateMaxAmountOfPacksMintable,
  calculateTotalAssetsRequiredForPacks,
  sortArrayForBundle,
} from "@/utils";

import { AssetsPerPack, MintProgressModal, NeededAssetsCard } from ".";
import packNFT from "../../../../public/img/pack-my-nft.png";

const ReviewAndMintStep: FC = () => {
  const { handleAllApprovals, handleAllMint } = useContractExecution();
  const { isTablet } = useWindowSize();
  const {
    selectedNative,
    nativeAmount,
    selectedTokens,
    tokenAmounts,
    selectedCollections,
    loading,
    setCurrentStep,
  } = useStore();
  const [packCount, setPackCount] = useState(1);
  const [isMintModalOpen, setMintModalOpen] = useState(false);
  const [currentMintStep, setCurrentMintStep] = useState(0);
  const totalMintSteps = selectedTokens.length + selectedCollections.length + 50;
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

  const handleMint = async () => {
    setMintModalOpen(true);

    try {
      setCurrentMintStep(0);
      const approvalData = await handleAllApprovals(
        selectedTokens,
        selectedCollections,
        tokenAmounts,
        packCount,
      );

      if (!approvalData.success) {
        throw new Error(approvalData.error ?? "An error occured during approval process.");
      }

      const sortedArrays = sortArrayForBundle(
        nativeAmount ?? 0,
        selectedTokens,
        selectedCollections,
        tokenAmounts,
        packCount,
      );
      setCurrentMintStep(1);
      const mintData = await handleAllMint(sortedArrays, packCount);
      console.log("result", mintData);

      if (!mintData.success) {
        throw new Error(mintData.error ?? "An error occured during approval process.");
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setMintModalOpen(false);
    }
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
        <Button colorScheme="teal" onClick={handleMint} isLoading={loading}>
          Mint Pack
        </Button>
      </Center>

      <MintProgressModal
        isOpen={isMintModalOpen}
        onClose={() => setMintModalOpen(false)}
        currentStep={currentMintStep}
        totalSteps={totalMintSteps}
        batchProgress={0}
      />
    </>
  );
};

export default ReviewAndMintStep;
