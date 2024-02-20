"use client";
import { type FC } from "react";

import { Box, Center, HStack, Heading, Link, useColorMode } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import NextLink from "next/link";
import { useAccount } from "wagmi";

import { useWindowSize } from "@/hooks/useWindowSize";
import useStore from "@/store/store";
import styles from "@/styles/header.module.css";

import logo from "../../../public/img/packmynft_logo.png";
import { DarkModeButton } from "../DarkModeButton";

const Header: FC = () => {
  const { isTablet, isSmallScreen } = useWindowSize();
  const { colorMode } = useColorMode();
  const { isConnected } = useAccount();
  const { reset } = useStore();

  const menuIems = (
    <Center
      gap={3}
      className={styles.menuContainer}
      background={colorMode === "light" ? "#fff" : "#1a202c"}
    >
      <Link as={NextLink} href="/mint" style={{ textDecoration: "none" }}>
        <Box className={styles.menuItem} onClick={() => reset()}>
          Mint
        </Box>
      </Link>

      <Link as={NextLink} href="/claim" style={{ textDecoration: "none" }}>
        <Box className={styles.menuItem} onClick={() => reset()}>
          Claim
        </Box>
      </Link>
    </Center>
  );

  return (
    <Box as="header">
      <HStack as="header" p={"1.5rem"} position="sticky" top={0} zIndex={10}>
        <Link as={NextLink} href="/" textDecoration={"none"} w={"100%"} justifyContent={"left"}>
          <HStack>
            <Image
              src={logo.src}
              alt="logo"
              width={45}
              height={45}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            {!isTablet && (
              <Heading as="h1" fontSize={"1.5rem"} className="text-shadow">
                Pack My NFT
              </Heading>
            )}
          </HStack>
        </Link>

        {!isSmallScreen && isConnected && (
          <HStack justifyContent={"center"} w={"100%"}>
            {menuIems}{" "}
          </HStack>
        )}

        <HStack justifyContent={"right"} w={"100%"}>
          <Box minW={isTablet ? 235 : 500} display={"flex"} justifyContent={"flex-end"}>
            <ConnectButton />
          </Box>
          <DarkModeButton />
        </HStack>
      </HStack>

      {isSmallScreen && isConnected && menuIems}
    </Box>
  );
};

export default Header;
