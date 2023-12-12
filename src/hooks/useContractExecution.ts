import useStore from "@/store/store";

import { useReadContract } from "./useReadContract";
import { useWriteContract } from "./useWriteContract";

export const useContractExecution = () => {
  const { setCurrentStep, setLoading, setError } = useStore();
  const { checkNftAllowance } = useReadContract();
  const { approveNft, executeTransfer721, executeTransfer1155 } = useWriteContract();

  const finalizeTransferSuccess = async () => {
    // fetchWeb3Data();
    setCurrentStep(2);
  };

  const handleErc721Transfer = async (
    collectionAddress: string,
    to: string,
    tokenIds: string[],
  ) => {
    const res = await executeTransfer721(collectionAddress, to, tokenIds);
    if (!res.success) throw new Error(res.error);
    finalizeTransferSuccess();
  };

  const handleErc1155Transfer = async (
    collectionAddress: string,
    to: string,
    tokenIds: string[],
    tokenAmounts: number[],
  ) => {
    const res = await executeTransfer1155(collectionAddress, to, tokenIds, tokenAmounts);
    if (!res.success) throw new Error(res.error);
    finalizeTransferSuccess();
  };

  const approve = async (collectionAddress: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    let success = false;

    try {
      const approval: boolean = await checkNftAllowance(collectionAddress as `0x${string}`);
      if (!approval) {
        const approvalStatus = await approveNft(collectionAddress);
        if (!approvalStatus.success) throw new Error(`Approval failed: ${approvalStatus.error}`);
      }
      success = true;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      return success;
    }
  };

  const transfer = async (
    collectionAddress: string,
    collectionType: string,
    to: string,
    tokenIds: string[],
    tokenAmounts?: number[],
  ) => {
    setLoading(true);
    setError(null);

    try {
      const type = collectionType.toLowerCase();
      if (type === "erc721") {
        await handleErc721Transfer(collectionAddress, to, tokenIds);
      } else if (type === "erc1155") {
        if (!tokenAmounts) throw new Error("Token amounts are required for ERC1155 transfer");
        await handleErc1155Transfer(collectionAddress, to, tokenIds, tokenAmounts);
      } else {
        throw new Error(`Unsupported collection type: ${collectionType}`);
      }
    } catch (err: any) {
      setError(err.message ?? err);
    } finally {
      setLoading(false);
    }
  };

  return { approve, transfer };
};
