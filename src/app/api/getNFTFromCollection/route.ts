import Moralis from "moralis";
import { NextRequest, NextResponse } from "next/server";

import { PACK_MY_NFT } from "@/data/constant";
import { startMoralis } from "@/services/moralisService";
import { getMoralisChain } from "@/utils";

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

    return NextResponse.json({
      success: true,
      data: nfts.raw.result,
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
