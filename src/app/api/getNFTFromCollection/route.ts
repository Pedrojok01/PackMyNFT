import Moralis from "moralis";
import { NextRequest, NextResponse } from "next/server";

import { PACK_MY_NFT } from "@/data/constant";
import { startMoralis } from "@/services/moralisService";
import { fixIpfsUrl, getMoralisChain } from "@/utils";

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

    const moralisChain = getMoralisChain(chainId);
    if (!moralisChain) {
      return NextResponse.json({ success: false, message: "Invalid chainId" }, { status: 400 });
    }

    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: moralisChain,
      address: account,
      tokenAddresses: [PACK_MY_NFT],
      normalizeMetadata: true,
      limit: 50,
    });

    // Resolve the NFT pack image once
    const packImageUrl = fixIpfsUrl(nfts.raw.result[0]);

    // Apply the resolved image URL to all NFTs
    const resolvedNfts: Nft[] = nfts.raw.result.map((nft) => ({ ...nft, image: packImageUrl }));

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
