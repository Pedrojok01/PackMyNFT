import { parseUnits } from "viem";

import useStore from "@/store/store";

import { useReadContract } from "./useReadContract";
import { useWriteContract } from "./useWriteContract";

export const useContractExecution = () => {
  const { setLoading } = useStore();
  const { checkAllApprovals } = useReadContract();
  const { approveToken, approveNft, mint, claimPack } = useWriteContract();

  /* Check existing allowance of an NFT collection (both ERC721 or ERC1155):
   **************************************************************************/
  const handleAllApprovals = async (
    selectedTokens: EvmToken[],
    selectedCollections: Collections,
    tokenAmounts: Record<string, string>,
    packAmount: number,
  ): Promise<Receipt> => {
    setLoading(true);

    try {
      const { tokenAllowances, nftApprovals } = await checkAllApprovals(
        selectedTokens,
        selectedCollections,
      );

      for (const [index, token] of selectedTokens.entries()) {
        const totalAmountNeeded = parseUnits(
          (Number(tokenAmounts[token.token_address]) * packAmount).toString(),
          Number(token.decimals),
        );

        if (totalAmountNeeded > (tokenAllowances[index] || 0n)) {
          const data = await approveToken(token, totalAmountNeeded.toString());
          if (!data.success && data.error) {
            throw new Error(data.error);
          }
        }
      }

      for (const [index, collection] of selectedCollections.entries()) {
        if (!nftApprovals[index]) {
          const data = await approveNft(collection.token_address);
          if (!data.success && data.error) {
            throw new Error(data.error);
          }
        }
      }
      return { success: true, data: null, error: null };
    } catch (err: any) {
      return { success: false, data: null, error: err.message ?? err };
    } finally {
      setLoading(false);
    }
  };

  const handleAllMint = async (
    bundleArrays: BundleArrays[],
    packCount: number,
    setPacksMinted: (packsMinted: number) => void,
  ): Promise<Receipt> => {
    setLoading(true);

    try {
      const receipt = await mint(bundleArrays, packCount, setPacksMinted);
      return receipt;
    } catch (err: any) {
      return { success: false, data: null, error: err.message ?? err };
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (tokenId: string): Promise<Receipt> => {
    setLoading(true);

    try {
      const receipt = await claimPack(tokenId);
      return receipt;
    } catch (err: any) {
      return { success: false, data: null, error: err.message ?? err };
    } finally {
      setLoading(false);
    }
  };

  return { handleAllApprovals, handleAllMint, handleClaim };
};
