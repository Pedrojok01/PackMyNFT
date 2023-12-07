// page.tsx
"use client";
import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import packNFT from "public/img/pack-my-nft.png";

import CustomLayout from "@/components/CustomLayout";

export default function Home() {
  return (
    <CustomLayout>
      <Flex align="center" justify="space-between">
        <Box width="50%">
          <Text fontSize="lg" fontWeight="bold">
            Pack My NFT
          </Text>
          <Text>Additional line 1</Text>
          <Text>Additional line 2</Text>
        </Box>

        <Box width="50%" transform="rotate(10deg)">
          <Image src={packNFT.src} alt="Pack My NFT" layout="responsive" width={200} height={200} />
        </Box>
      </Flex>
    </CustomLayout>
  );
}
