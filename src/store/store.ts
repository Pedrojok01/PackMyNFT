// store.js
import { create } from "zustand";

interface StoreData {
  selectedNative: NativeCoin | undefined;
  selectedTokens: EvmToken[];
  selectedCollections: Collection[];
  currentStep: number;
  setSelectedNative: (selectedNative: any) => void;
  setSelectedTokens: (selectedTokens: EvmToken[]) => void;
  setSelectedCollections: (selectedCollections: Collection[]) => void;
  setCurrentStep: (currentStep: number) => void;
}

const useStore = create<StoreData>((set) => ({
  selectedNative: undefined,
  selectedTokens: [],
  selectedCollections: [],
  currentStep: 1,
  setSelectedNative: (native) => set({ selectedNative: native }),
  setSelectedTokens: (tokens) => set({ selectedTokens: tokens }),
  setSelectedCollections: (nfts) => set({ selectedCollections: nfts }),
  setCurrentStep: (step) => set({ currentStep: step }),
}));

export default useStore;
