// components/ReviewAndMintStep.tsx
import { useState, type FC } from "react";

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  HStack,
  Heading,
  Input,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";

import { CustomDivider } from "@/components";
import useStore from "@/store/store";
import { calculateMaxAmountOfPacksMintable } from "@/utils/calculateMaxAmountOfPacksMintable";
import { calculateTotalAssetsRequiredForPacks } from "@/utils/calculateTotalAssetsRequiredForPacks";

import { MintButton } from ".";
import AssetsPerPack from "./AssetsPerPack";
import packNFT from "../../../../public/img/pack-my-nft.png";

interface ReviewAndMintStepProps {
  onMint: () => void;
}

const ReviewAndMintStep: FC<ReviewAndMintStepProps> = ({ onMint }) => {
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

  return (
    <Box>
      <HStack alignItems={"flex-start"}>
        <Box position={"relative"} w={"50%"}>
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
          <Image src={packNFT.src} alt="Pack My NFT" width={400} height={400} />
        </Box>

        <Box w={"50%"}>
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
            onChange={(e) => setPackCount(Math.max(1, Number(e.target.value)))}
          />

          <CustomDivider />

          <Card>
            <CardHeader>
              <Heading size="md">Total assets needed for {packCount} packs:</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                {selectedNative && (
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Native
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {totalNative} {selectedNative.symbol}
                    </Text>
                  </Box>
                )}
                {selectedTokens?.length > 0 && (
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Tokens
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {Object.entries(totalTokens).map(([tokenAddress, amount]) => {
                        const token = selectedTokens.find((t) => t.token_address === tokenAddress);
                        return (
                          <li key={tokenAddress}>
                            {amount} {token?.symbol || "Unknown Token"}
                          </li>
                        );
                      })}
                    </Text>
                  </Box>
                )}

                {selectedCollections?.length > 0 && (
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      NFTs
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {Object.entries(totalNfts).map(([tokenAddress, amount]) => {
                        const collection = selectedCollections.find(
                          (c) => c.token_address === tokenAddress,
                        );
                        return (
                          <li key={tokenAddress}>
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
