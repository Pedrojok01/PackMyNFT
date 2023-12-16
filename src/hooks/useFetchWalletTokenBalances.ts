import useSWR from "swr";

import { APP_URL } from "@/data/constant";
import { ExtendedError, fetcher } from "@/utils";

interface TokensBalances {
  tokens: EvmToken[];
  isLoading: boolean;
  isError: ExtendedError | undefined;
}

export const useFetchTokenBalances = (account: `0x${string}`, chainId: number): TokensBalances => {
  const { data, error, isLoading } = useSWR<TokenResponse>(
    account && chainId ? [`${APP_URL}api/getWalletTokenBalances`, account, chainId] : null,
    (params) => {
      const [url, acc, id] = params as [string, `0x${string}`, number];
      return fetcher({ key: url, account: acc, chainId: id });
    },
  );

  return {
    tokens: data?.data ?? [],
    isLoading: isLoading,
    isError: error,
  };
};
