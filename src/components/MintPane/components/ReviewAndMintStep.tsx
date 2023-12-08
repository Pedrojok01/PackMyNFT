// components/ReviewAndMintStep.tsx
import { useState, type FC } from "react";

import { Box, Button, Center, Input, Text } from "@chakra-ui/react";

import useStore from "@/store/store";
import { calculateTotalAssets } from "@/utils/calculateTotalAssets";

import { MintButton } from ".";
import SelectedAssets from "./SelectedAssets";

interface ReviewAndMintStepProps {
  onMint: () => void;
}

const ReviewAndMintStep: FC<ReviewAndMintStepProps> = ({ onMint }) => {
  const { selectedNative, selectedTokens, selectedCollections, setCurrentStep } = useStore();
  const [packCount, setPackCount] = useState(1);
  const totalRequiredAssets = calculateTotalAssets(
    selectedNative,
    selectedTokens,
    selectedCollections,
    packCount,
  );

  return (
    <Box>
      <Text fontSize="lg" mb={4}>
        Review your pack contents
      </Text>

      <SelectedAssets readOnly={true} />

      <Input
        type="number"
        min={1}
        value={packCount}
        onChange={(e) => setPackCount(Math.max(1, Number(e.target.value)))}
      />
      <Text>Total Assets Needed: {totalRequiredAssets.totalNative}</Text>

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
