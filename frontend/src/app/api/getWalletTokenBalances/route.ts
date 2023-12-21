import Moralis from "moralis";
import { NextRequest, NextResponse } from "next/server";

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

    const tokenResponse = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: moralisChain,
      address: account,
    });

    return NextResponse.json({
      success: true,
      data: tokenResponse,
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
