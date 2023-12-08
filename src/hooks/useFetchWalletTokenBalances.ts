import useSWR from "swr";

import { APP_URL } from "@/data/constant";
import fetcher from "@/utils/fetcher";

interface TokensBalances {
  tokens: EvmToken[];
  isLoading: boolean;
  isError: any;
}

export const useFetchTokenBalances = (account: `0x${string}`, chainId: number): TokensBalances => {
  const { data, error, isLoading } = useSWR(
    account && chainId ? [`${APP_URL}api/getWalletTokenBalances`, account, chainId] : null,
    ([url, account, chainId]) => fetcher({ key: url, account, chainId }),
  );

  return {
    tokens: data?.tokenResponse ?? [],
    isLoading: isLoading,
    isError: error,
  };
};
