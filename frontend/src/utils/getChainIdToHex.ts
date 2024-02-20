export const getChainIdToHex = (chainId: number): string => {
  return "0x" + chainId.toString(16);
};
