import { type Address, type PublicClient, getContract } from "viem";
import { useAccount, usePublicClient } from "wagmi";

import { ERC20_ABI, ERC721_ABI } from "@/data/abis";
import { PACK_MY_NFT } from "@/data/constant";

export const useReadContract = () => {
  const { address } = useAccount();
  const publicClient: PublicClient = usePublicClient();

  /* Check if existing allowance of ERC20 token :
   ***********************************************/
  const checkTokenAllowance = async (token: Address): Promise<number | bigint> => {
    if (!publicClient) throw new Error("Public client not initialized");

    const tokenInstance = getContract({
      abi: ERC20_ABI,
      address: token,
      publicClient: publicClient,
    });

    try {
      const allowance = await tokenInstance.read.allowance([address as string, PACK_MY_NFT]);
      return allowance as number | bigint;
    } catch (error: any) {
      console.log(error.details ?? error.reason ?? error.message ?? error);
      return 0;
    }
  };

  /* Check existing allowance of an NFT collection (both ERC721 or ERC1155):
   **************************************************************************/
  const checkNftAllowance = async (nft: Address): Promise<boolean> => {
    if (!publicClient) throw new Error("Public client not initialized");

    const nftInstance = getContract({
      abi: ERC721_ABI,
      address: nft,
      publicClient: publicClient,
    });

    try {
      const allowance = await nftInstance.read.isApprovedForAll([address as string, PACK_MY_NFT]);
      return allowance as boolean;
    } catch (error: any) {
      console.error(error.details ?? error.reason ?? error.message ?? error);
      return false;
    }
  };

  return {
    checkTokenAllowance,
    checkNftAllowance,
  };
};
