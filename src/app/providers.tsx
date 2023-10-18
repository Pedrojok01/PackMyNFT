"use client";
import { type ReactNode, useState, useEffect } from "react";

import { CacheProvider } from "@chakra-ui/next-js";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";

import { chains, config } from "@/wagmi";

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const theme = extendTheme({ initialColorMode: "dark", useSystemColorMode: false });

  return (
    <WagmiConfig config={config}>
      <CacheProvider>
        <ChakraProvider resetCSS theme={theme}>
          <RainbowKitProvider chains={chains}>{mounted && children}</RainbowKitProvider>
        </ChakraProvider>
      </CacheProvider>
    </WagmiConfig>
  );
}
