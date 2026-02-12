import { create } from "zustand";
import type { User as FirebaseUser } from "firebase/auth";
import type { User } from "@/types/user";
import { getUserData } from "@/lib/firebase/auth";

interface AuthState {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setUserData: (data: User | null) => void;
  setLoading: (loading: boolean) => void;
  refreshUserData: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userData: null,
  loading: true,
  setUser: (user) => set({ user }),
  setUserData: (userData) => set({ userData }),
  setLoading: (loading) => set({ loading }),
  refreshUserData: async () => {
    const { user } = get();
    if (!user) return;
    const data = await getUserData(user.uid);
    set({ userData: data });
  },
}));
