import { ExtendedError } from "./extendedError";

type FetcherParams = {
  key: string;
  account: `0x${string}`;
  chainId: number;
};

export const fetcher = async <T>({ key, account, chainId }: FetcherParams): Promise<T> => {
  const res = await fetch(key, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ account, chainId }),
  });

  if (!res.ok) {
    const error = new ExtendedError("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};
