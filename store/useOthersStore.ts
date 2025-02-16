import { create } from "zustand";

interface OthersType {
  loading: boolean;
  setLoadingStatus: (status: boolean) => void;
}

export const useOthersStore = create<OthersType>((set) => ({
  loading: false,
  setLoadingStatus: (status) => set({ loading: status }),
}));
