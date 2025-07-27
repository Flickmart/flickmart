import { UserStore } from "@/types/user";
import { create } from "zustand";

const useUserStore = create<UserStore>((set, get) => ({
  session: {
    access_token: "",
    expires_at: 0,
    expires_in: 0,
    refresh_token: "",
    token_type: "",
  },
  user: {
    created_at: "",
    id: "",
    email: "",
    role: "",
    is_anonymous: false,
    last_sign_in_at: "",
    phone: "",
  },
  updateEmail: (email: string) => set((state) => ({ ...state, email })),
  updateUserInfo: (user) => set((state) => ({ ...state, user: { ...user } })),
  createSession: (sessionObj) =>
    set((state) => ({
      ...state,
      session: { ...state.session, ...sessionObj },
    })),
  email: "",
  
}));

export default useUserStore;
