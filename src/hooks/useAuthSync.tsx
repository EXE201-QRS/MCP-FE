"use client";

import { getSessionTokenFromLocalStorage } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface User {
  id: string;
  roleName: "ADMIN_SYSTEM" | "CUSTOMER" | string; // tùy vào app bạn
  // thêm field khác nếu cần
}

interface AuthStore {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: User;
  forceRefresh: () => Promise<void>;
}

/**
 * Hook để đồng bộ auth state sau login
 */
export function useAuthSync() {
  const router = useRouter();
  const { forceRefresh, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkTokenChange = async () => {
      const token = getSessionTokenFromLocalStorage();

      if (token && !isAuthenticated && !isLoading) {
        await forceRefresh();
      }
    };

    checkTokenChange();
    const interval = setInterval(checkTokenChange, 1000);
    return () => clearInterval(interval);
  }, [forceRefresh, isAuthenticated, isLoading]);

  return { isLoading, isAuthenticated };
}

/**
 * Hook để handle post-login navigation
 */
export function usePostLoginNavigation() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const navigateAfterLogin = (targetUrl?: string) => {
    if (!isAuthenticated || !user) return;

    if (targetUrl) {
      window.location.href = targetUrl;
    } else {
      const defaultRoute =
        user.roleName === "ADMIN_SYSTEM"
          ? "/manage/dashboard"
          : "/customer/dashboard";

      window.location.href = defaultRoute;
    }
  };

  return { navigateAfterLogin };
}
