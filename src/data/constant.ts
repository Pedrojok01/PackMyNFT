export const isProdEnv = process.env.NEXT_PUBLIC_NODE_ENV === "production" ? true : false;

export const MAX_INT = 2n ** 256n - 1n;
export const APP_URL = process.env.NEXT_PUBLIC_URL;

export const SUPPORTED_CHAIN = {
  mainnet: [1, 10, 56, 137, 250, 42161],
  testnet: [5, 97, 420, 4002, 80001, 421613],
};

export const MAX_ASSETS_PER_PACK = 5;

/* 
Deployed at the same address on:
 - Ethereum, Goerli, 
 - BSC, BSC Testnet, 
 - Polygon, Polygon Mumbai,
 - Optimism, Optimism Goerli, 
 - ArbitrumOne, Arbitrum Testnet, 
 - Fantom Opera, Fantom Testnet
*/
export const PACK_MY_NFT = "";
