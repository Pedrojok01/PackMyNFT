import { ExtendedError } from "./extendedError";

type FetcherParams = {
  key: string;
  account?: `0x${string}`;
  chainId: number;
  tokenAddresses?: `0x${string}`[];
  nftAddresses?: { address: `0x${string}`; tokenId: string }[];
};

export const fetcher = async <T>({
  key,
  account,
  chainId,
  tokenAddresses,
  nftAddresses,
}: FetcherParams): Promise<T> => {
  let body = {};
  if (account && chainId) {
    body = { account, chainId };
  } else if (tokenAddresses && nftAddresses && chainId) {
    body = { tokenAddresses, nftAddresses, chainId };
  }

  const res = await fetch(key, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = new ExtendedError("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};
