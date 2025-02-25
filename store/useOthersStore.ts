import { create } from "zustand";

interface OthersType {
  loading: boolean;
  image: File | null;
  storeImage: (image: File) => void;
  setLoadingStatus: (status: boolean) => void;
}

export const useOthersStore = create<OthersType>((set) => ({
  loading: false,
  image: null,
  storeImage: (image) => set({ image }),
  setLoadingStatus: (status) => set({ loading: status }),
}));
