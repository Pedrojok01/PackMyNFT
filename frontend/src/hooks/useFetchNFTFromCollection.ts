// hooks/useFetchWalletNFTs.ts
import useSWR, { mutate } from "swr";

import { APP_URL } from "@/data/constant";
import { ExtendedError, fetcher } from "@/utils";

interface FetchedNFTs {
  nfts: Nft[];
  isLoading: boolean;
  isError: ExtendedError | undefined;
  refetch: () => Promise<FetchedNFTs>;
}

export const useFetchNFTFromCollection = (account: `0x${string}`, chainId: number): FetchedNFTs => {
  const swrKey =
    account && chainId ? [`${APP_URL}api/getNFTFromCollection`, account, chainId] : null;

  const { data, error, isLoading } = useSWR<NFTResponse>(
    swrKey,
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

  // Sort NFTs based on token_id
  const sortedNfts = data?.data.sort((a, b) => parseInt(a.token_id) - parseInt(b.token_id)) ?? [];

  const refetch = () => mutate(swrKey);

  return {
    nfts: sortedNfts,
    isLoading: isLoading,
    isError: error,
    refetch,
  };
};
