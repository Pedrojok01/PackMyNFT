// components/ReviewAndMintStep.tsx
import { useState, type FC } from "react";

import { Box, Button, Center, HStack, Input, Text, useColorMode } from "@chakra-ui/react";
import Image from "next/image";
import packNFT from "public/img/pack-my-nft.png";

import useStore from "@/store/store";
import { calculateTotalAssets } from "@/utils/calculateTotalAssets";

import { MintButton } from ".";
import SelectedAssets from "./SelectedAssets";

interface ReviewAndMintStepProps {
  onMint: () => void;
}

const ReviewAndMintStep: FC<ReviewAndMintStepProps> = ({ onMint }) => {
  const { colorMode } = useColorMode();
  const { selectedNative, selectedTokens, selectedCollections, setCurrentStep } = useStore();
  const [packCount, setPackCount] = useState(1);
  const totalRequiredAssets = calculateTotalAssets(
    selectedNative,
    selectedTokens,
    selectedCollections,
    packCount,
  );

  const backgroundColor =
    colorMode === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(26, 32, 44, 0.8)";

  return (
    <Box>
      <Text fontSize="lg" mb={4}>
        Review your content per pack
      </Text>

      <HStack>
        <Box position={"relative"} w={"50%"}>
          <Box
            position={"absolute"}
            w={"100%"}
            h={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Box bg={backgroundColor} p={2} borderRadius={8}>
              <SelectedAssets readOnly={true} />
            </Box>
          </Box>
          <Image src={packNFT.src} alt="Pack My NFT" width={400} height={400} />
        </Box>

        <Box w={"50%"}>
          <Text mb="8px">Number of pack to mint: (max: 150)</Text>
          <Input
            type="number"
            min={1}
            value={packCount}
            isRequired={true}
            onChange={(e) => setPackCount(Math.max(1, Number(e.target.value)))}
          />
          <Text>Total Assets Needed: {totalRequiredAssets.totalNative}</Text>
        </Box>
      </HStack>

      <Center gap={10} mt={10} mb={3}>
        <Button onClick={() => setCurrentStep(1)} colorScheme="gray">
          Back
        </Button>
        <MintButton onMint={onMint} />
      </Center>
    </Box>
  );
};

export default ReviewAndMintStep;
