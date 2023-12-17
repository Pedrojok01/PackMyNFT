// hooks/useFetchWalletNFTs.ts
import useSWR from "swr";

import { APP_URL } from "@/data/constant";
import { ExtendedError, fetcher } from "@/utils";

interface FetchedNFTs {
  nfts: Nft[];
  isLoading: boolean;
  isError: ExtendedError | undefined;
}

export const useFetchNFTFromCollection = (account: `0x${string}`, chainId: number): FetchedNFTs => {
  const { data, error, isLoading } = useSWR<NFTResponse>(
    account && chainId ? [`${APP_URL}api/getNFTFromCollection`, account, chainId] : null,
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
    nfts: data?.data ?? [],
    isLoading: isLoading,
    isError: error,
  };
};
