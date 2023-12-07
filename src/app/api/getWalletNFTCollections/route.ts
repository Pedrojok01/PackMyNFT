import Moralis from "moralis";
import { NextRequest, NextResponse } from "next/server";

import { getMoralisChain } from "@/utils/getMoralisChain";
import { startMoralis } from "@/utils/startMoralis";

type RequestBody = {
  account: `0x${string}`;
  chainId: number;
};

export const config = {
  runtime: "experimental-edge",
};

export async function POST(request: NextRequest) {
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

    const collectionsResponse = await Moralis.EvmApi.nft.getWalletNFTCollections({
      address: account,
      chain: moralisChain,
    });

    const collections = collectionsResponse.raw.result;

    return NextResponse.json({
      collections,
    });
  } catch (error: any) {
    console.error("Error fetching NFT collections:", error);
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
