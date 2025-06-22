import authApiRequest from "@/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";

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
