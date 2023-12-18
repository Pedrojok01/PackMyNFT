import { parseEther } from "viem";

import { parseTokenBalance } from ".";

export const sortArrayForBundle = (
  nativeAmount: string,
  tokens: EvmToken[],
  collections: Collections,
  tokenAmounts: Record<string, string>,
  packAmount: number,
): BundleArrays[] => {
  // Filter out ERC721 and ERC1155 tokens from the collections
  const ERC721s = collections.filter((collection) => collection.contract_type === "ERC721");
  const ERC1155s = collections.filter((collection) => collection.contract_type === "ERC1155");

  // Addresses Array: Static list of all addresses
  const addressesArray: `0x${string}`[] = [
    ...tokens.map((token) => token.token_address as `0x${string}`),
    ...ERC721s.map((collection) => collection.token_address as `0x${string}`),
    ...ERC1155s.map((collection) => collection.token_address as `0x${string}`),
  ];

  // Function to generate numbersArray for a single pack
  const generateNumbersArrayForPack = (packIndex: number): bigint[] => [
    parseEther(nativeAmount.toString()), // ETH amount in wei
    BigInt(tokens.length), // Number of ERC20 tokens
    BigInt(ERC721s.length), // Number of ERC721 tokens
    BigInt(ERC1155s.length), // Number of ERC1155 tokens
    ...tokens.map((token) =>
      parseTokenBalance(Number(tokenAmounts[token.token_address]), token.decimals),
    ), // ERC20 token amounts in wei
    // Selecting one ERC721 NFT ID per pack
    ...ERC721s.map((collection) =>
      BigInt(collection.nfts[packIndex % collection.nfts.length].token_id),
    ),
    // Selecting one ERC1155 NFT ID per pack (if packAmount > NFTs in collection, it loops)
    ...ERC1155s.map((collection) =>
      BigInt(collection.nfts[packIndex % collection.nfts.length].token_id),
    ),
    ...ERC1155s.map(() => BigInt(1)), // Assuming 1 per NFT for ERC1155
  ];

  return Array.from({ length: packAmount }, (_, index) => ({
    addressesArray,
    numbersArray: generateNumbersArrayForPack(index),
  }));
};
