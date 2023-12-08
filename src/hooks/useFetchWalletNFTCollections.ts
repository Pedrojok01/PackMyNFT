import useSWR from "swr";

import { APP_URL } from "@/data/constant";
import fetcher from "@/utils/fetcher";

interface NFTCollections {
  collections: Collection[];
  isLoading: boolean;
  isError: any;
}

export const useFetchWalletNFTCollections = (
  account: `0x${string}`,
  chainId: number,
): NFTCollections => {
  const { data, error, isLoading } = useSWR(
    account && chainId ? [`${APP_URL}api/getWalletNFTCollections`, account, chainId] : null,
    ([url, account, chainId]) => fetcher({ key: url, account, chainId }),
  );

  return {
    collections: data?.collections ?? [],
    isLoading: isLoading,
    isError: error,
  };
};
