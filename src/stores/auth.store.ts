"use client";

import { toast } from "sonner";
import { create } from "zustand";

import authApiRequest from "@/apiRequests/auth";
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
  setIsAuthenticated: (isAuth: boolean) => void;
  setIsLoading: (loading: boolean) => void;

  // Async actions
  fetchUserProfile: () => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Sync actions
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),

  // Fetch user profile
  fetchUserProfile: async () => {
    try {
      set({ isLoading: true });
      const response = await authApiRequest.me();
      set({
        user: (response.payload as unknown as { data: UserType }).data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Failed to fetch user profile:", error);
      removeTokensFromLocalStorage();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

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

  // Initialize auth state
  initialize: async () => {
    const token = getSessionTokenFromLocalStorage();
    if (token) {
      await get().fetchUserProfile();
    } else {
      set({ isLoading: false });
    }
  },
}));

// Initialize auth when store is created
if (typeof window !== "undefined") {
  useAuthStore.getState().initialize();
}
