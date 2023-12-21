export const isProdEnv = process.env.NEXT_PUBLIC_NODE_ENV === "production" ? true : false;

export const MAX_INT = 2n ** 256n - 1n;
export const APP_URL = process.env.NEXT_PUBLIC_URL;

export const SUPPORTED_CHAIN = {
  mainnet: [1, 10, 56, 137, 250, 42161],
  testnet: [11155111, 97, 420, 4002, 80001, 421614],
};

export const MAX_ASSETS_PER_PACK = 5;
export const MAX_PACKS_PER_TXN = 200;

/* 
Deployed at the same address on:
 - Ethereum: 
 - Sepolia: deployed & verified 
 - Polygon: deployed & verified
 - Polygon Mumbai: deployed & verified
 - Optimism: deployed & verified 
 - Optimism Goerli: deployed & verified 
 - ArbitrumOne:
 - Arbitrum Sepolia Testnet: deployed
 - Fantom Opera: deployed & verified 
 - Fantom Testnet: deployed & verified
 - BSC: deployed & verified 
 - BSC Testnet: deployed
*/
export const PACK_MY_NFT: `0x${string}` = "0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b"; // testnet all good, nonce = 5
