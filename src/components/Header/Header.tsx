"use client";
import { type FC } from "react";

import { Box, Center, HStack, Heading, Link, useColorMode } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import NextLink from "next/link";
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
      <Link as={NextLink} href="/mint" style={{ textDecoration: "none" }}>
        <Box className={styles.menuItem}>Mint</Box>
      </Link>

      <Link as={NextLink} href="/claim" style={{ textDecoration: "none" }}>
        <Box className={styles.menuItem}>Claim</Box>
      </Link>
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
        <Link as={NextLink} href="/" style={{ textDecoration: "none" }}>
          <HStack>
            <Image src={logo.src} alt="logo" width={45} height={45} />
            {!isTablet && (
              <Heading as="h1" fontSize={"1.5rem"} className="text-shadow">
                Pack My NFT
              </Heading>
            )}
          </HStack>
        </Link>

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
