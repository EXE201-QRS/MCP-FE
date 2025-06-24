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
  forceRefresh: () => Promise<void>;
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
      console.log('📝 Fetching user profile...');
      set({ isLoading: true });
      const response = await authApiRequest.me();
      const userData = (response.payload as unknown as { data: UserType }).data;
      console.log('✅ User profile fetched successfully:', userData);
      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("❌ Failed to fetch user profile:", error);
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
    try {
      console.log('🚀 Initializing auth state...');
      set({ isLoading: true });
      
      const token = getSessionTokenFromLocalStorage();
      if (token) {
        console.log('🎫 Token found, fetching profile...');
        // Fetch user profile if token exists
        await get().fetchUserProfile();
      } else {
        console.log('❌ No token found, setting as unauthenticated');
        // No token, set as unauthenticated
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error("❌ Auth initialization error:", error);
      // Clear invalid data
      removeTokensFromLocalStorage();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },

  // Force refresh auth state
  forceRefresh: async () => {
    const token = getSessionTokenFromLocalStorage();
    if (token) {
      await get().fetchUserProfile();
    } else {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },
}));

