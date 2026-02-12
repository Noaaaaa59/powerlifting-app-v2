import { create } from "zustand";
import type { User as FirebaseUser } from "firebase/auth";
import type { User } from "@/types/user";

interface AuthState {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setUserData: (data: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userData: null,
  loading: true,
  setUser: (user) => set({ user }),
  setUserData: (userData) => set({ userData }),
  setLoading: (loading) => set({ loading }),
}));
