// hooks/useMintingProcess.js
import { useState, useCallback } from "react";

import { useContractExecution } from "@/hooks";
import useStore from "@/store/store";
import { calculateMaxAmountOfPacksMintable, sortArrayForBundle } from "@/utils";

export const useMintingProcess = () => {
  const {
    selectedNative,
    selectedTokens,
    selectedCollections,
    tokenAmounts,
    nativeAmount,
    packCount,
    setCurrentStep,
  } = useStore();
  const { handleAllApprovals, handleAllMint } = useContractExecution();
  const [isMintModalOpen, setMintModalOpen] = useState(false);
  const [currentMintStep, setCurrentMintStep] = useState(0);
  const [packsMinted, setPacksMinted] = useState(0);
  const batchProgress = (packsMinted / packCount) * 100;
  //   const batchProgress = `${packsMinted}/${packCount}`;

  const maxPackCount = calculateMaxAmountOfPacksMintable(
    selectedNative,
    nativeAmount,
    selectedTokens,
    tokenAmounts,
    selectedCollections,
  );

  const handleMint = useCallback(async () => {
    setMintModalOpen(true);
    try {
      setCurrentMintStep(0);
      const approvalData = await handleAllApprovals(
        selectedTokens,
        selectedCollections,
        tokenAmounts,
        packCount,
      );

      if (!approvalData.success) {
        throw new Error(approvalData.error ?? "Error during approval process.");
      }

      const sortedArrays = sortArrayForBundle(
        nativeAmount ?? 0,
        selectedTokens,
        selectedCollections,
        tokenAmounts,
        packCount,
      );
      setCurrentMintStep(1);
      const mintData = await handleAllMint(sortedArrays, packCount, setPacksMinted);

      if (!mintData.success) {
        throw new Error(mintData.error ?? "Error during minting process.");
      }
      setCurrentStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setMintModalOpen(false);
    }
  }, [
    packCount,
    selectedTokens,
    selectedCollections,
    tokenAmounts,
    nativeAmount,
    handleAllApprovals,
    handleAllMint,
    setCurrentStep,
  ]);

  return {
    handleMint,
    isMintModalOpen,
    setMintModalOpen,
    currentMintStep,
    packsMinted,
    batchProgress,
    maxPackCount,
    packCount,
  };
};
