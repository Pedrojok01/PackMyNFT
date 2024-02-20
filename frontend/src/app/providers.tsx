"use client";
import { type ReactNode, useState, useEffect } from "react";

import { CacheProvider } from "@chakra-ui/next-js";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { config } from "@/wagmi";

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const queryClient = new QueryClient();

  const theme = extendTheme({
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
      cssVarPrefix: "packMyNFT",
    },
    colors: {
      brand: {
        200: "#008080",
        500: "#008080",
      },
    },
  });

  const appInfo = {
    appName: "PackMyNFT",
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CacheProvider>
          <ChakraProvider resetCSS theme={theme}>
            <RainbowKitProvider
              coolMode
              // chains={chains}
              appInfo={appInfo}
              theme={lightTheme({
                accentColor: "#008080",
              })}
            >
              {mounted && children}
            </RainbowKitProvider>
          </ChakraProvider>
        </CacheProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
