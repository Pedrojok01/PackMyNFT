import { EvmChain } from "@moralisweb3/common-evm-utils";

export const getMoralisChain = (chainId: number) => {
  switch (chainId) {
    case 1:
      return EvmChain.ETHEREUM;
    case 5:
      return EvmChain.GOERLI;
    case 10:
      return EvmChain.OPTIMISM;
    case 56:
      return EvmChain.BSC;
    case 97:
      return EvmChain.BSC_TESTNET;
    case 137:
      return EvmChain.POLYGON;
    case 250:
      return EvmChain.FANTOM;
    case 4002:
      return EvmChain.FANTOM_TESTNET;
    case 42161:
      return EvmChain.ARBITRUM;
    case 80001:
      return EvmChain.MUMBAI;
    case 421613:
      return EvmChain.ARBITRUM_TESTNET;
    default:
      return EvmChain.ETHEREUM;
  }
};
