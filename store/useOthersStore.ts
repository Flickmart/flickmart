import { create } from "zustand";

interface OthersType {
  loading: boolean;
  images: Array<string>;
  storeImage: (images: Array<string>) => void;
  setLoadingStatus: (status: boolean) => void;
}

export const useOthersStore = create<OthersType>((set) => ({
  loading: false,
  images: [],
  storeImage: (images) => set({ images }),
  setLoadingStatus: (status) => set({ loading: status }),
}));
