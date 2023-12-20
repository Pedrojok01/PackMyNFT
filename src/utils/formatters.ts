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

// Format a token balance to a bigint based on its amount of decimals
export const parseTokenBalance = (amount: number, decimals: string): bigint => {
  try {
    const fixedAmount = amount.toFixed(Number(decimals));
    return parseUnits(fixedAmount, Number(decimals));
  } catch (error) {
    console.error("Error parsing token balance:", error);
    return BigInt(0);
  }
};

// Format a token bigint balance to a readable string
export const formatNumber = (amount: string, decimals: string): string => {
  return formatUnits(BigInt(amount), Number(decimals));
};

// Format a token balance to a bigint based on its decimals
export const parseNumber = (amount: string, decimals: string): bigint => {
  try {
    const fixedAmount = parseFloat(amount).toFixed(Number(decimals));
    return parseUnits(fixedAmount, Number(decimals));
  } catch (error) {
    console.error("Error parsing number:", error);
    return BigInt(0);
  }
};

export const trimDecimals = (value: string): string => {
  // If the value contains a decimal point, trim trailing zeros
  if (value.includes(".")) {
    return value.replace(/(\.\d*[1-9])0+$|\.0*$/, "$1");
  }
  // Return the original value if no decimal point is present
  return value;
};
