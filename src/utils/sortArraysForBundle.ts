export const sortArrayForBundle = (
  nativeAmount: number,
  tokens: EvmToken[],
  NFTs: EvmNft[],
): BundleArrays => {
  const ERC20s = tokens || [];
  const ERC721s = (NFTs || []).filter((nft) => nft.contract_type === "ERC721");
  const ERC1155s = (NFTs || []).filter((nft) => nft.contract_type === "ERC1155");

  const addressesArray: `0x${string}`[] = [
    ...ERC20s.map((token) => token.token_address as `0x${string}`),
    ...ERC721s.map((nft) => nft.token_address as `0x${string}`),
    ...ERC1155s.map((nft) => nft.token_address as `0x${string}`),
  ];

  const numbersArray = [
    nativeAmount,
    ERC20s.length,
    ERC721s.length,
    ERC1155s.length,
    ...ERC20s.map((token) => BigInt(token.balance)),
    ...ERC721s.map((nft) => nft.token_id),
    ...ERC1155s.map((nft) => nft.token_id),
    ...ERC1155s.map((nft) => nft.amount || 0),
  ];

  return {
    addressesArray,
    numbersArray,
  };
};
