import { formatEther } from "viem";

type NativeAsset = {
  decimals: number;
  name: string;
  symbol: string;
};

export const categorizeAssets = (
  addresses: string[],
  numbers: bigint[],
  native: NativeAsset,
): CategorizedAssets => {
  const categorizedAssets: CategorizedAssets = {
    native: { address: "ETH", amount: "0", type: "native" },
    ERC20: {},
    ERC721: {},
    ERC1155: {},
  };

  const ethAmount = numbers[0];
  const erc20Length = Number(numbers[1]);
  const erc721Length = Number(numbers[2]);
  const erc1155Length = Number(numbers[3]);
  let amountPointer = 4;

  categorizedAssets.native = {
    address: "ETH",
    name: native.symbol,
    amount: formatEther(ethAmount),
    type: "native",
  };

  // Assign ERC20 tokens
  for (let i = 0; i < erc20Length; i++) {
    categorizedAssets.ERC20[i] = {
      address: addresses[i],
      amount: numbers[amountPointer].toString(),
    };
    amountPointer++;
  }

  // Skip to the start of ERC721 token addresses
  for (let j = 0; j < erc721Length; j++) {
    categorizedAssets.ERC721[j] = {
      address: addresses[erc20Length + j],
      amount: "1", // ERC721 tokens are always 1 in this app
      tokenId: numbers[4 + erc20Length + j].toString(),
    };
  }

  // Skip to the start of ERC1155 token addresses
  for (let k = 0; k < erc1155Length; k++) {
    categorizedAssets.ERC1155[k] = {
      address: addresses[erc20Length + erc721Length + k],
      amount: "1",
      tokenId: numbers[4 + erc20Length + erc721Length + k].toString(),
    };
  }

  return categorizedAssets;
};
