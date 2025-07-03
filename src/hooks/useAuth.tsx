import authApiRequest from "@/apiRequests/auth";
import {
  getSessionTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.login,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.register,
  });
};

export const useSendOTPMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.sendOTP,
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.forgotPassword,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: authApiRequest.sUpdateProfile,
    onSuccess: (data) => {
      // Update user in auth store
      updateUser({
        name: data.payload.data.name,
        phoneNumber: data.payload.data.phoneNumber,
      });
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: ["account-me"] });
    },
  });
};

export const useAccountMe = () => {
  const { setUser, setIsAuthenticated, setIsLoading } = useAuthStore();

  const query = useQuery({
    queryKey: ["account-me"],
    queryFn: authApiRequest.me,
    enabled: !!getSessionTokenFromLocalStorage(), // Only run if token exists
    retry: false, // Don't retry on auth errors
  });

  // Sync query state with auth store
  useEffect(() => {
    if (query.isLoading) {
      setIsLoading(true);
    } else if (query.isError) {
      removeTokensFromLocalStorage();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    } else if (query.isSuccess && query.data) {
      setUser(query.data.payload.data);
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [
    query.isLoading,
    query.isError,
    query.isSuccess,
    query.data,
    query.error,
    setUser,
    setIsAuthenticated,
    setIsLoading,
  ]);

  return query;
};

/**
 * Hook để force refresh user data
 */
export const useRefreshAuth = () => {
  const queryClient = useQueryClient();

  const refreshAuth = async () => {
    const token = getSessionTokenFromLocalStorage();
    if (token) {
      await queryClient.invalidateQueries({ queryKey: ["account-me"] });
    }
  };

  return { refreshAuth };
};
