import { NextRequest, NextResponse } from "next/server";

import { fetchCollections, fetchNFTs, startMoralis } from "@/services/moralisService";
import { getChainIdToHex, processCollections } from "@/utils";

type RequestBody = {
  account: `0x${string}`;
  chainId: number;
};

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
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

  try {
    const collectionsPromise = fetchCollections(account, moralisChain);
    const nftsPromise = fetchNFTs(account, moralisChain);

    const [collectionsResponse, nfts] = await Promise.all([collectionsPromise, nftsPromise]);
    const collections = collectionsResponse.raw.result.filter(
      (collection) => !collection.possible_spam,
    );

    const data = processCollections(collections, nfts);

    return NextResponse.json({
      success: true,
      data: data,
      message: "NFTs fetched successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error in Moralis data fetching:", errorMessage);

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
