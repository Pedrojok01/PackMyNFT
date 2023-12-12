import { type PublicClient, getContract, parseUnits } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

import { PACKMYNFT_ABI, ERC721_ABI, ERC20_ABI } from "@/data/abis";
import { PACK_MY_NFT } from "@/data/constant";
import { handleErrors } from "@/utils/errorHandling";

import { useNotify } from ".";

export const useWriteContract = () => {
  // const { chain } = useNetwork();
  const { notifyError, openNotification } = useNotify();
  const publicClient: PublicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  /* Set Token Allowance:
   ***************************/
  const approveToken = async (token: EvmToken, allowance: string) => {
    if (!walletClient) throw new Error("Wallet client not initialized");

    const tokenInstance = getContract({
      abi: ERC20_ABI,
      address: token.token_address as `0x${string}`,
      walletClient: walletClient,
    });

    const allowanceToBn = parseUnits(allowance, Number(token.decimals));

    try {
      const hash = await tokenInstance.write.approve([PACK_MY_NFT, allowanceToBn]);
      await publicClient.waitForTransactionReceipt({
        confirmations: 3,
        hash: hash,
      });
      openNotification(
        "success",
        "Token Approval set",
        `Allowance succesfully set to ${allowance}.`,
      );
      return { success: true, data: hash, error: null };
    } catch (error: any) {
      const message = handleErrors(error, ERC20_ABI);
      notifyError(message);
      return { success: false, data: null, error: message };
    }
  };

  /* Approve an NFT collection (both ERC721 and ERC1155):
   *******************************************************/
  const approveNft = async (nft: string) => {
    if (!walletClient) throw new Error("Wallet client not initialized");

    const nftInstance = getContract({
      abi: ERC721_ABI, // Same for ERC1155
      address: nft as `0x${string}`,
      walletClient: walletClient,
    });

    try {
      const hash = await nftInstance.write.setApprovalForAll([PACK_MY_NFT, true]);
      await publicClient.waitForTransactionReceipt({
        confirmations: 3,
        hash: hash,
      });
      openNotification("success", "NFT Approval set", "Allowance successfully set.");
      return { success: true, data: hash, error: null };
    } catch (error: any) {
      const message = handleErrors(error, PACKMYNFT_ABI);
      notifyError(message);
      return { success: false, data: null, error: message };
    }
  };

  // Execute a Bundle:

  /* Execute a batch transfer:
   ****************************/

  type Method = "batchTransferERC721" | "batchTransferERC1155";
  type Params = [string, string, string[], number[]?];

  const executeTransfer = async (method: Method, params: Params) => {
    if (!walletClient) throw new Error("Wallet client not initialized");

    const PACK_MY_NFTInstance = getContract({
      abi: PACKMYNFT_ABI,
      address: PACK_MY_NFT as `0x${string}`,
      walletClient: walletClient,
    });

    try {
      const hash = await PACK_MY_NFTInstance.write[method](params);
      const transaction = await publicClient.waitForTransactionReceipt({
        confirmations: 4,
        hash: hash,
      });
      // notifySuccess({hash, chain?.id});
      return { success: true, data: transaction, error: null };
    } catch (error: any) {
      const message = handleErrors(error, PACKMYNFT_ABI);
      notifyError(message);
      return { success: false, data: null, error: message };
    }
  };

  const executeTransfer721 = (collectionAddress: string, receiver: string, tokenIds: string[]) =>
    executeTransfer("batchTransferERC721", [collectionAddress, receiver, tokenIds]);

  const executeTransfer1155 = (
    collectionAddress: string,
    receiver: string,
    tokenIds: string[],
    tokenAmounts: number[],
  ) =>
    executeTransfer("batchTransferERC1155", [collectionAddress, receiver, tokenIds, tokenAmounts]);

  return {
    approveToken,
    approveNft,
    executeTransfer721,
    executeTransfer1155,
  };
};
