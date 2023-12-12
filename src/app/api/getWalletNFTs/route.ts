import { NextRequest, NextResponse } from "next/server";

import { fetchCollections, fetchNFTs, startMoralis } from "@/services/moralisService";
import { getMoralisChain, processCollections } from "@/utils";

type RequestBody = {
  account: `0x${string}`;
  chainId: number;
};

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
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

  try {
    const collectionsPromise = fetchCollections(account, moralisChain);
    const nftsPromise = fetchNFTs(account, moralisChain);

    const [collectionsResponse, nfts] = await Promise.all([collectionsPromise, nftsPromise]);
    const collections = collectionsResponse.raw.result.filter(
      (collection) => !collection.possible_spam,
    );

    const data = processCollections(collections, nfts);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in Moralis data fetching:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error occurred",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
