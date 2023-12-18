// components/SuccessClaim.tsx
import { type FC } from "react";

import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";

import { SuccessBox } from "@/components";
import { useAssetsMetadata } from "@/hooks";
import useStore from "@/store/store";
import { formatNumber } from "@/utils";

interface SuccessClaimProps {
  eventData: EventData;
}

const SuccessClaim: FC<SuccessClaimProps> = ({ eventData }) => {
  const { nftToClaim } = useStore();
  const { colorMode } = useColorMode();
  const { native, tokens, nfts } = useAssetsMetadata({
    addresses: eventData.addresses,
    numbers: eventData.numbers,
  });

  const assetBackgroundColor =
    colorMode === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(26, 32, 44, 0.8)";

  const boxBackgroundColor =
    colorMode === "light" ? "rgb(224, 225, 227, 80%)" : "rgb(54, 60, 73, 80%)";

  const renderAsset = (asset: TokenData | NftData | AssetDetail, type: string, index: number) => {
    const amount =
      type === "ERC20" && "decimals" in asset
        ? formatNumber(asset.amount, asset.decimals ?? 18)
        : asset.amount;

    if (type === "ERC1155" && "normalized_metadata" in asset) {
      asset.name = asset.normalized_metadata?.name ?? "Unknown";
    }

    return (
      <Box key={index} bg={assetBackgroundColor} p={2} borderRadius={8} mb={1}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>
            {amount} {asset.name} ({type})
          </Text>
        </Flex>
      </Box>
    );
  };

  return (
    <SuccessBox>
      <Text fontSize="lg" mb={5}>
        You have successfully claim the Pack Id {nftToClaim?.token_id}.
      </Text>

      <Box bg={boxBackgroundColor} p={5} borderRadius={10}>
        <Text fontSize="lg" mb={2}>
          Here is the content you have just unpacked:
        </Text>

        {native &&
          Number(native.amount) > 0 &&
          renderAsset(native, "native", Number(native.amount))}
        {tokens.map((token, index) => renderAsset(token, "ERC20", index))}
        {nfts.map((nft, index) => renderAsset(nft, nft.contract_type, index))}
      </Box>

      <Box mb={10} />
    </SuccessBox>
  );
};

export default SuccessClaim;
