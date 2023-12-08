"use client";
import type { FC, ReactNode } from "react";

import { Box, Flex, Image } from "@chakra-ui/react";
// import Image from "next/image";
import shape_bottom from "public/img/background_shape_bottom.png";
import shape_top from "public/img/background_shape_top.png";

import { Footer, Header } from "@/components";

type CustomLayoutProps = {
  children: ReactNode;
};

const CustomLayout: FC<CustomLayoutProps> = ({ children }) => {
  return (
    <Flex flexDirection="column" minHeight="100vh" position="relative">
      <Header />

      <Box position="absolute" top="0" right="0" zIndex={-10}>
        <Image alt="background shape" src={shape_top.src} width={350} height={"auto"} />
      </Box>

      <Box as="main" flex={1} p={4} pt={"4rem"}>
        {children}
      </Box>

      <Box position="absolute" bottom="0" left="0" zIndex={-10}>
        <Image alt="background shape" src={shape_bottom.src} width={350} height={"auto"} />
      </Box>

      <Footer />
    </Flex>
  );
};

export default CustomLayout;
