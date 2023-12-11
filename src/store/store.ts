// store.js
import { create } from "zustand";

interface StoreData {
  selectedNative: NativeCoin | undefined;
  nativeAmount: number | undefined;
  selectedTokens: EvmToken[];
  tokenAmounts: Record<string, number>; // Store amounts for each token by token address
  selectedCollections: Collections;
  currentStep: number;
  setSelectedNative: (selectedNative: NativeCoin) => void;
  setNativeAmount: (amount: number) => void;
  setSelectedTokens: (selectedTokens: EvmToken[]) => void;
  setTokenAmount: (tokenAddress: string, amount: number) => void;
  setSelectedCollections: (selectedCollections: Collections) => void;
  setCurrentStep: (currentStep: number) => void;
}

const useStore = create<StoreData>((set) => ({
  selectedNative: undefined,
  nativeAmount: undefined,
  selectedTokens: [],
  tokenAmounts: {},
  selectedCollections: [],
  currentStep: 1,
  setSelectedNative: (native) => set({ selectedNative: native }),
  setNativeAmount: (amount) => set({ nativeAmount: amount }),
  setSelectedTokens: (tokens) => set({ selectedTokens: tokens }),
  setTokenAmount: (tokenAddress, amount) =>
    set((state) => ({
      tokenAmounts: { ...state.tokenAmounts, [tokenAddress]: amount },
    })),
  setSelectedCollections: (nfts) => set({ selectedCollections: nfts }),
  setCurrentStep: (step) => set({ currentStep: step }),
}));

export default useStore;
