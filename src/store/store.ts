// store.ts
import { create } from "zustand";

interface StoreData {
  selectedNative: NativeCoin | undefined;
  setSelectedNative: (selectedNative: NativeCoin | undefined) => void;
  nativeAmount: number | undefined;
  setNativeAmount: (amount: number | undefined) => void;
  selectedTokens: EvmToken[];
  setSelectedTokens: (selectedTokens: EvmToken[]) => void;
  tokenAmounts: Record<string, number>; // Store amounts for each token by token address
  setTokenAmount: (tokenAddress: string, amount: number) => void;
  selectedCollections: Collections;
  setSelectedCollections: (selectedCollections: Collections) => void;
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  reset: () => void;
}

const useStore = create<StoreData>((set) => ({
  selectedNative: undefined,
  setSelectedNative: (native) => set({ selectedNative: native }),
  nativeAmount: undefined,
  setNativeAmount: (amount) => set({ nativeAmount: amount }),
  selectedTokens: [],
  setSelectedTokens: (tokens) => set({ selectedTokens: tokens }),
  tokenAmounts: {},
  setTokenAmount: (tokenAddress, amount) =>
    set((state) => ({
      tokenAmounts: { ...state.tokenAmounts, [tokenAddress]: amount },
    })),
  selectedCollections: [],
  setSelectedCollections: (nfts) => set({ selectedCollections: nfts }),
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),
  reset: () =>
    set({
      selectedNative: undefined,
      nativeAmount: undefined,
      selectedTokens: [],
      tokenAmounts: {},
      selectedCollections: [],
      currentStep: 1,
      error: null,
      loading: false,
    }),
}));

export default useStore;
