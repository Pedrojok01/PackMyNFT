import type { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

// Function to start moralis service
export const startMoralis = async () => {
  if (!MORALIS_API_KEY) {
    throw new Error("MORALIS_API_KEY is not defined");
  }

  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: MORALIS_API_KEY });
  }
};

// Function to fetch collections
export async function fetchCollections(account: string, chain: EvmChain) {
  return Moralis.EvmApi.nft.getWalletNFTCollections({ address: account, chain });
}

// Function to fetch NFTs
export async function fetchNFTs(account: string, chain: EvmChain) {
  const initialResponse = await Moralis.EvmApi.nft.getWalletNFTs({
    address: account,
    chain,
    normalizeMetadata: true,
  });

  const nfts = initialResponse.raw.result ? [...initialResponse.raw.result] : [];
  let currentTx = initialResponse;

  // Pagination support (if applicable)
  while (currentTx.hasNext()) {
    const nextTx = await currentTx.next();
    if (nextTx.raw.result) {
      nfts.push(...nextTx.raw.result);
    }
    currentTx = nextTx;
  }

  return nfts;
}
