import Moralis from "moralis";
import { NextRequest, NextResponse } from "next/server";

import { startMoralis } from "@/services/moralisService";
import { getMoralisChain } from "@/utils";

type RequestBody = {
  tokenAddresses: `0x${string}`[];
  nftAddresses: { address: `0x${string}`; tokenId: string }[];
  chainId: number;
};

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  await startMoralis();
  const { tokenAddresses, nftAddresses, chainId } = (await request.json()) as RequestBody;

  if (!tokenAddresses || !nftAddresses || !chainId) {
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
    // Fetching token metadata
    const tokensMetadata = await Moralis.EvmApi.token.getTokenMetadata({
      chain: moralisChain,
      addresses: [...tokenAddresses],
    });

    // Fetching NFT collection metadata in parallel
    const collectionMetadataPromises = nftAddresses.map((nft) =>
      Moralis.EvmApi.nft.getNFTMetadata({
        chain: moralisChain,
        address: nft.address,
        normalizeMetadata: true,
        tokenId: nft.tokenId,
      }),
    );
    const collectionMetadataResults = await Promise.all(collectionMetadataPromises);
    const nftsMetadata = collectionMetadataResults.map((result) => result?.raw);

    return NextResponse.json({
      success: true,
      data: { tokensMetadata, nftsMetadata },
      message: "Assets Metadata fetched successfully",
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
