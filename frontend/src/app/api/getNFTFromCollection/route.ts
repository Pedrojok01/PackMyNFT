import Moralis from "moralis";
import { NextRequest, NextResponse } from "next/server";

import { PACK_MY_NFT } from "@/data/constant";
import { startMoralis } from "@/services/moralisService";
import { fixIpfsUrl, getChainIdToHex } from "@/utils";

type RequestBody = {
  account: `0x${string}`;
  chainId: number;
};

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await startMoralis();

    const { account, chainId } = (await request.json()) as RequestBody;
    if (!account || !chainId) {
      return NextResponse.json(
        { success: false, message: "Missing account or chainId" },
        { status: 400 },
      );
    }

    const moralisChain = getChainIdToHex(chainId);
    if (!moralisChain) {
      return NextResponse.json({ success: false, message: "Invalid chainId" }, { status: 400 });
    }

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: moralisChain,
      format: "decimal",
      limit: 50,
      tokenAddresses: [PACK_MY_NFT],
      mediaItems: false,
      address: account,
      normalizeMetadata: true,
    });

    let resolvedNfts: Nft[] = [];

    if (response.raw.result.length > 0) {
      // Resolve the NFT pack image once
      const packImageUrl = fixIpfsUrl(response.raw.result[0]);

      // Apply the resolved image URL to all NFTs
      resolvedNfts = response.raw.result.map((nft) => ({ ...nft, image: packImageUrl }));
    }

    return NextResponse.json({
      success: true,
      data: resolvedNfts,
      message: "Tokens fetched successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error fetching NFTs:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        message: "Server error occurred",
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
