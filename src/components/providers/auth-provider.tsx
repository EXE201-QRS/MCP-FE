"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useAccountMe } from "@/hooks/useAuth";
import { ReactNode, useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider để initialize auth state và tự động sync với useAccountMe
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize } = useAuthStore();
  
  // Sử dụng useAccountMe để tự động fetch user data nếu có token
  useAccountMe();

  // Initialize auth state khi app start
  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
