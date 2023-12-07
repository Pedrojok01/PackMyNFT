import { networks } from "../data/networks";

export const getExplorer = (chainId: number) => {
  switch (chainId) {
    case 1:
      return networks.ethereum.blockExplorers?.default.url;
    case 5:
      return networks.goerli.blockExplorers?.default.url;
    case 10:
      return networks.optimism.blockExplorers?.default.url;
    case 56:
      return networks.bnb.blockExplorers?.default.url;
    case 97:
      return networks.bnb_test.blockExplorers?.default.url;
    case 137:
      return networks.polygon.blockExplorers?.default.url;
    case 250:
      return networks.fantom.blockExplorers?.default.url;
    case 420:
      return networks.optimismGoerli.blockExplorers?.default.url;
    case 4002:
      return networks.fantomTestnet.blockExplorers?.default.url;
    case 42161:
      return networks.arbitrum.blockExplorers?.default.url;
    case 80001:
      return networks.mumbai.blockExplorers?.default.url;
    case 421613:
      return networks.arbitrumGoerli.blockExplorers?.default.url;
    default:
      return networks.ethereum.blockExplorers?.default.url;
  }
};
