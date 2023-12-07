import useSWR from "swr";

import { APP_URL } from "@/data/constant";
import fetcher from "@/utils/fetcher";

export const useFetchWalletNFTs = (account: `0x${string}`, chainId: number) => {
  const { data, error, isLoading } = useSWR(
    account && chainId ? [`${APP_URL}api/getWalletNFTs`, account, chainId] : null,
    ([url, account, chainId]) => fetcher({ key: url, account, chainId }),
  );

  return {
    nfts: data?.nfts ?? [],
    isLoading: isLoading,
    isError: error,
  };
};
