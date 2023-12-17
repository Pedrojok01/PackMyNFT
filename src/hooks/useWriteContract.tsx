import { type PublicClient, getContract, parseUnits } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

import { PACKMYNFT_ABI, ERC721_ABI, ERC20_ABI } from "@/data/abis";
import { MAX_PACKS_PER_TXN, PACK_MY_NFT } from "@/data/constant";
import { formatNumber } from "@/utils";
import { handleErrors } from "@/utils/errorHandling";

import { useNotify } from ".";

export const useWriteContract = () => {
  const { address } = useAccount();
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
        `Allowance succesfully set to ${formatNumber(allowance, token.decimals)}.`,
      );
      return { success: true, data: hash, error: null };
    } catch (error: any) {
      const message = handleErrors(error, ERC20_ABI);
      notifyError({ title: "An error occured during token approval", message: message });
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
      notifyError({ title: "An error occured during NFT approval", message: message });
      return { success: false, data: null, error: message };
    }
  };

  /* Single Mint function:
   ************************/
  const singleMint = async (
    packMyNftInstance: any,
    addressesArray: `0x${string}`[],
    numbersArray: bigint[],
  ) => {
    await publicClient.simulateContract({
      address: PACK_MY_NFT,
      abi: PACKMYNFT_ABI,
      functionName: "safeMint",
      account: address,
      args: [address, addressesArray, numbersArray],
    });

    const hash = await packMyNftInstance.write.safeMint([address, addressesArray, numbersArray]);
    const receipt = await publicClient.waitForTransactionReceipt({ confirmations: 3, hash: hash });
    return { success: true, data: receipt, error: null };
  };

  /* batch Mint function:
   ***********************/
  const batchMint = async (
    packMyNftInstance: any,
    addressesArray: `0x${string}`[],
    numbersArrays: bigint[][],
    packCount: number,
  ) => {
    await publicClient.simulateContract({
      address: PACK_MY_NFT,
      abi: PACKMYNFT_ABI,
      functionName: "batchMint",
      account: address,
      args: [address, addressesArray, numbersArrays, packCount],
    });

    const hash = await packMyNftInstance.write.batchMint([
      address,
      addressesArray,
      numbersArrays,
      packCount,
    ]);
    const receipt = await publicClient.waitForTransactionReceipt({ confirmations: 3, hash: hash });

    return { success: true, data: receipt, error: null };
  };

  /* Execute mint:
   *****************/
  const mint = async (
    bundleArrays: BundleArrays[],
    packCount: number,
    setPacksMinted: (packsMinted: number) => void,
  ): Promise<Receipt> => {
    if (!walletClient) throw new Error("Wallet client not initialized");

    const packMyNftInstance = getContract({
      abi: PACKMYNFT_ABI,
      address: PACK_MY_NFT,
      walletClient: walletClient,
    });

    const addressesArray = bundleArrays[0].addressesArray;

    try {
      if (packCount === 1) {
        return await singleMint(packMyNftInstance, addressesArray, bundleArrays[0].numbersArray);
      } else {
        let remainingPacks = packCount;
        let transactionIndex = 0;
        let totalPacksMinted = 0;
        const batchResults = [];

        while (remainingPacks > 0) {
          const packsThisTxn = Math.min(remainingPacks, MAX_PACKS_PER_TXN);
          const batchArraysForThisTxn = bundleArrays.slice(
            transactionIndex * MAX_PACKS_PER_TXN,
            (transactionIndex + 1) * MAX_PACKS_PER_TXN,
          );

          const numbersArrays = batchArraysForThisTxn.map((bundle) => bundle.numbersArray);
          const result = await batchMint(
            packMyNftInstance,
            addressesArray,
            numbersArrays,
            packsThisTxn,
          );
          batchResults.push(result.data);

          if (result.success) {
            totalPacksMinted += packsThisTxn;
            setPacksMinted(totalPacksMinted); // Update the packs minted so far
          }

          remainingPacks -= packsThisTxn;
          transactionIndex++;
        }

        return { success: true, data: batchResults, error: null };
      }
    } catch (error) {
      const message = handleErrors(error, PACK_MY_NFT);
      notifyError({ title: "An error occured during mint", message: message });
      return { success: false, data: null, error: message };
    }
  };

  /* Execute a Bundle mint:
   *************************/

  return {
    approveToken,
    approveNft,
    mint,
  };
};
