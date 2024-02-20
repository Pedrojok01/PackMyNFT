import { useState, useEffect } from "react";

import useSWR from "swr";
import { useAccount } from "wagmi";

import { APP_URL } from "@/data/constant";
import { categorizeAssets, ExtendedError, fetcher } from "@/utils";

interface AssetsArrays {
  addresses: string[];
  numbers: bigint[];
}

interface AssetsMetadata {
  native: AssetDetail;
  tokens: TokenData[];
  nfts: NftData[];
  isLoading: boolean;
  isError: ExtendedError | undefined;
}

export const useAssetsMetadata = ({ addresses, numbers }: AssetsArrays): AssetsMetadata => {
  const { chain } = useAccount();
  const [categorizedAssets, setCategorizedAssets] = useState<CategorizedAssets>();
  const [tokenAddresses, setTokenAddresses] = useState<`0x${string}`[]>([]);
  const [nftAddresses, setNftAddresses] = useState<{ address: `0x${string}`; tokenId: string }[]>(
    [],
  );

  if (!chain) {
    throw new Error("No chain found");
  }

  useEffect(() => {
    const assets = categorizeAssets(addresses, numbers, chain?.nativeCurrency);
    setCategorizedAssets(assets);

    const erc20Addresses = Object.values(assets.ERC20).map(
      (asset) => asset.address as `0x${string}`,
    );
    const nftData = [...Object.values(assets.ERC721), ...Object.values(assets.ERC1155)].map(
      (asset) => ({ address: asset.address as `0x${string}`, tokenId: asset.tokenId ?? "1" }),
    );

    setTokenAddresses(erc20Addresses);
    setNftAddresses(nftData);
  }, [addresses, numbers, chain]);

  const { data, error, isLoading } = useSWR<MetadataResponse>(
    tokenAddresses.length > 0 || nftAddresses.length > 0
      ? [`${APP_URL}api/getAssetsMetadata`, tokenAddresses, nftAddresses, chain?.id]
      : null,
    (params) => {
      const [url, tokenAddrs, nftAddrs, chainId] = params as [
        string,
        `0x${string}`[],
        { address: `0x${string}`; tokenId: string }[],
        number,
      ];
      return fetcher({ key: url, tokenAddresses: tokenAddrs, nftAddresses: nftAddrs, chainId });
    },
  );

  // Merge amounts into tokens and nfts
  const mergedTokens = data?.data?.tokensMetadata.map((token) => {
    const amount = Object.values(categorizedAssets?.ERC20 ?? {}).find(
      (a) => a.address.toLowerCase() === token.address.toLowerCase(),
    )?.amount;
    return { ...token, amount: amount ?? "0" };
  });

  const mergedNfts = data?.data?.nftsMetadata.map((nft) => {
    const assetERC721 = Object.values(categorizedAssets?.ERC721 ?? {}).find(
      (a) => a.address.toLowerCase() === nft.token_address.toLowerCase(),
    );
    const assetERC1155 = Object.values(categorizedAssets?.ERC1155 ?? {}).find(
      (a) => a.address.toLowerCase() === nft.token_address.toLowerCase(),
    );
    const amount = assetERC721?.amount ?? assetERC1155?.amount ?? "1";
    return { ...nft, amount: amount }; // Default amount for NFTs is usually 1
  });

  return {
    native: categorizedAssets?.native ?? { address: "ETH", amount: "0", type: "native" },
    tokens: mergedTokens ?? [],
    nfts: mergedNfts ?? [],
    isLoading: isLoading,
    isError: error,
  };
};
