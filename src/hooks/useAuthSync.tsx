"use client";

import { getSessionTokenFromLocalStorage } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface User {
  id: string;
  roleName: "ADMIN_SYSTEM" | "CUSTOMER" | string;
}

interface AuthStore {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: User;
  forceRefresh: () => Promise<void>;
}

/**
 * Hook để đồng bộ auth state sau login/register
 */
export function useAuthSync() {
  const { forceRefresh, isLoading, isAuthenticated } = useAuthStore();
  const lastTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const checkTokenChange = async () => {
      const currentToken = getSessionTokenFromLocalStorage();
      
      // Nếu token thay đổi (từ null thành có hoặc ngược lại)
      if (currentToken !== lastTokenRef.current) {
        lastTokenRef.current = currentToken;
        
        if (currentToken && !isAuthenticated && !isLoading) {
          console.log('🔄 Token detected, refreshing auth state...');
          await forceRefresh();
        }
      }
    };

    // Check ngay khi mount
    checkTokenChange();
    
    // Check mỗi 500ms (giảm từ 1000ms)
    const interval = setInterval(checkTokenChange, 500);
    
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
