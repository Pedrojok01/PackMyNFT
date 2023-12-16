// hooks/useFetchWalletNFTs.ts
import useSWR from "swr";

import { APP_URL } from "@/data/constant";
import { ExtendedError, fetcher } from "@/utils";

interface FetchedNFTs {
  collections: Collections;
  isLoading: boolean;
  isError: ExtendedError | undefined;
}

export const useFetchWalletNFTs = (account: `0x${string}`, chainId: number): FetchedNFTs => {
  const { data, error, isLoading } = useSWR<NFTResponse>(
    account && chainId ? [`${APP_URL}api/getWalletNFTs`, account, chainId] : null,
    (params) => {
      const [url, acc, id] = params as [string, `0x${string}`, number];
      return fetcher({ key: url, account: acc, chainId: id });
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 120000, // 2 minute
    },
  );

  return {
    collections: data?.data ?? [],
    isLoading: isLoading,
    isError: error,
  };
};
