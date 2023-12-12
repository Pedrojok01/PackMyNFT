import { formatUnits, parseUnits } from "viem";

export const getEllipsisTxt = (str: `0x${string}`, n: number = 6): string => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
  }
  return "";
};

// Format a token bigint balance to a readable string
export const formatTokenBalance = (asset: EvmToken): string => {
  return formatUnits(BigInt(asset.balance), Number(asset.decimals));
};

// Format a token bigint balance to a string
export const parseTokenBalance = (amount: number, decimals: string): bigint => {
  return parseUnits(amount.toString(), Number(decimals));
};
