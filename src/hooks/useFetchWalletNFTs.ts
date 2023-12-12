// hooks/useFetchWalletNFTs.ts
import useSWR from "swr";

import { APP_URL } from "@/data/constant";
import { fetcher } from "@/utils";

interface FetchedNFTs {
  collections: Collections;
  isLoading: boolean;
  isError: Error | undefined;
}

export const useFetchWalletNFTs = (account: `0x${string}`, chainId: number): FetchedNFTs => {
  const { data, error, isLoading } = useSWR(
    account && chainId ? [`${APP_URL}api/getWalletNFTs`, account, chainId] : null,
    ([url, account, chainId]) => fetcher({ key: url, account, chainId }),
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
