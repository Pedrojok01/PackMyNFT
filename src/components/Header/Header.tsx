"use client";
import { type FC } from "react";

import { Box, Center, HStack, Heading, useColorMode } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import logo from "public/img/packmynft_logo.png";

import { useWindowSize } from "@/hooks/useWindowSize";
import styles from "@/styles/header.module.css";

import { DarkModeButton } from "../DarkModeButton";

const Header: FC = () => {
  const { isTablet } = useWindowSize();
  const { colorMode } = useColorMode();

  const menuIems = (
    <Center
      gap={3}
      className={styles.menuContainer}
      background={colorMode === "light" ? "#fff" : "#1a202c"}
    >
      <Box className={styles.menuItem}>Mint</Box>
      <Box className={styles.menuItem}>Claim</Box>
    </Center>
  );

  return (
    <Box>
      <HStack
        as="header"
        p={"1.5rem"}
        position="sticky"
        top={0}
        zIndex={10}
        justifyContent={"space-between"}
      >
        <HStack>
          <Image src={logo.src} alt="logo" width={45} height={45} />
          {!isTablet && (
            <Heading as="h1" fontSize={"1.5rem"} className="text-shadow">
              Pack My NFT
            </Heading>
          )}
        </HStack>

        {!isTablet && menuIems}

        <HStack>
          <ConnectButton />
          <DarkModeButton />
        </HStack>
      </HStack>

      {isTablet && menuIems}
    </Box>
  );
};

export default Header;
