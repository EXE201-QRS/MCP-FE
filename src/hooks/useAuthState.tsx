import { useAuthStore } from "@/stores/auth.store";
import { useAccountMe } from "@/hooks/useAuth";

/**
 * Hook tổng hợp để sử dụng trong components cần auth data
 * Tự động fetch user profile và sync với store
 */
export function useAuth() {
  const authStore = useAuthStore();
  
  // Fetch user profile nếu có token
  const accountQuery = useAccountMe();
  
  return {
    // Auth state từ store
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    
    // Actions từ store
    logout: authStore.logout,
    
    // Query state từ useAccountMe
    isRefetching: accountQuery.isRefetching,
    error: accountQuery.error,
  };
}
