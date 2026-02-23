import { create } from 'zustand';

type OthersType = {
  loading: boolean;
  images: string[];
  storeImage: (images: string[]) => void;
  setLoadingStatus: (status: boolean) => void;
};

export const useOthersStore = create<OthersType>((set) => ({
  loading: false,
  images: [],
  storeImage: (images) => set({ images }),
  setLoadingStatus: (status) => set({ loading: status }),
}));
