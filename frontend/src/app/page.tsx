// page.tsx
"use client";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import Image from "next/image";

import CustomLayout from "@/components/CustomLayout";
import styles from "@/styles/home.module.css";

import packNFT from "../../public/img/pack-my-nft.png";

export default function Home() {
  const { colorMode } = useColorMode();

  const backgroundColor =
    colorMode === "light" ? "rgba(255, 255, 255, 0.5)" : "rgba(26, 32, 44, 0.5)";

  return (
    <CustomLayout>
      <Flex className={styles.container}>
        <Box className={styles.subContainer}>
          <Text className={`${styles.subtitle} text-shadow`} bgColor={backgroundColor}>
            Bundle crypto assets into single NFTs packs with
          </Text>
          <Text className={`${styles.title} text-shadow`} bgColor={backgroundColor}>
            Pack My NFT
          </Text>
          <Text className={`${styles.subtitle} text-shadow`} bgColor={backgroundColor}>
            Support all existing assets, as well as batch minting
          </Text>
        </Box>

        <Box className={`${styles.subContainer} ${styles.subContainerImage}`}>
          <Image
            src={packNFT.src}
            alt="Pack My NFT"
            priority={true}
            width={200}
            height={200}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Box>
      </Flex>
    </CustomLayout>
  );
}
