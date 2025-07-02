"use client";

import { toast } from "sonner";
import { create } from "zustand";

import {
  getSessionTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";
import { UserType } from "@/schemaValidations/user.model";

interface AuthState {
  // State
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: UserType | null) => void;
  updateUser: (updates: Partial<UserType>) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  setIsLoading: (loading: boolean) => void;

  // Async actions
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Sync actions
  setUser: (user) => set({ user }),
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null,
  })),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),

  // Logout
  logout: async () => {
    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Clear local storage
      removeTokensFromLocalStorage();

      // Update state
      set({
        user: null,
        isAuthenticated: false,
      });

      // Redirect to login
      window.location.href = "/login";

      toast.success("Đăng xuất thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng xuất");
    }
  },

  // Initialize auth state - chỉ check token có tồn tại
  initialize: () => {
    const token = getSessionTokenFromLocalStorage();
    if (token) {
      console.log('🎫 Token found, auth will be handled by useAccountMe hook');
    } else {
      console.log('❌ No token found, setting as unauthenticated');
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },
}));
