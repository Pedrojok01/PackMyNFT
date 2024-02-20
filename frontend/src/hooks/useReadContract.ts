import { type Address, getContract } from "viem";
import { useAccount, usePublicClient } from "wagmi";

import { ERC20_ABI, ERC721_ABI } from "@/data/abis";
import { PACK_MY_NFT } from "@/data/constant";

export const useReadContract = () => {
  const { address } = useAccount();
  const client = usePublicClient();

  /* Check if existing allowance of ERC20 token :
   ***********************************************/
  const checkTokenAllowance = async (token: Address): Promise<bigint> => {
    if (!client) throw new Error("Public client not initialized");

    const tokenInstance = getContract({
      abi: ERC20_ABI,
      address: token,
      client: client,
    });

    try {
      const allowance = await tokenInstance.read.allowance([address as string, PACK_MY_NFT]);
      return allowance as bigint;
    } catch (error: any) {
      console.error(error.details ?? error.reason ?? error.message ?? error);
      return 0n;
    }
  };

  /* Check existing allowance of an NFT collection (both ERC721 or ERC1155):
   **************************************************************************/
  const checkNftAllowance = async (nft: Address): Promise<boolean> => {
    if (!client) throw new Error("Public client not initialized");

    const nftInstance = getContract({
      abi: ERC721_ABI,
      address: nft,
      client: client,
    });

    try {
      const allowance = await nftInstance.read.isApprovedForAll([address as string, PACK_MY_NFT]);
      return allowance as boolean;
    } catch (error: any) {
      console.error(error.details ?? error.reason ?? error.message ?? error);
      return false;
    }
  };

  /* Check existing allowance of an NFT collection (both ERC721 or ERC1155):
   **************************************************************************/
  const checkAllApprovals = async (tokens: EvmToken[], collections: Collections) => {
    const tokenAllowances = await Promise.all(
      tokens.map((token) => checkTokenAllowance(token.token_address as `0x${string}`)),
    );

    const nftApprovals = await Promise.all(
      collections.map((collection) => checkNftAllowance(collection.token_address as `0x${string}`)),
    );

    return { tokenAllowances, nftApprovals };
  };

  return {
    checkTokenAllowance,
    checkNftAllowance,
    checkAllApprovals,
  };
};
