import authApiRequest from "@/apiRequests/auth";
import { UpdateProfileBodyType } from "@/schemaValidations/auth.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";

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
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};
