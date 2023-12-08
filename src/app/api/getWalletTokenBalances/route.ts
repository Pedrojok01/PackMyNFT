import Moralis from "moralis";
import { NextRequest, NextResponse } from "next/server";

import { getMoralisChain } from "@/utils/getMoralisChain";
import { startMoralis } from "@/utils/startMoralis";

type RequestBody = {
  account: `0x${string}`;
  chainId: number;
};

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<EvmToken[] | NextResponse> {
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
      tokenResponse,
    });
  } catch (error: any) {
    console.error("Error fetching NFTs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error occurred",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
