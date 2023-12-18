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
  nftToClaim: Nft | undefined;
  setNftToClaim: (nft: Nft | undefined) => void;
  eventData: EventData | undefined;
  setEventData: (eventData: EventData | undefined) => void;
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
  packCount: number;
  setPackCount: (packCount: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
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
  nftToClaim: undefined,
  setNftToClaim: (nft) => set({ nftToClaim: nft }),
  eventData: undefined,
  setEventData: (eventData) => set({ eventData }),
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  packCount: 1,
  setPackCount: (packCount) => set({ packCount }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  reset: () =>
    set({
      selectedNative: undefined,
      nativeAmount: undefined,
      selectedTokens: [],
      tokenAmounts: {},
      selectedCollections: [],
      nftToClaim: undefined,
      eventData: undefined,
      currentStep: 1,
      packCount: 1,
      loading: false,
    }),
}));

export default useStore;
