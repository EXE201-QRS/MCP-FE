import paymentApiRequests from "@/apiRequests/payment";
import { useMutation } from "@tanstack/react-query";

export const useCreatePayOSPaymentMutation = () => {
  return useMutation({
    mutationFn: paymentApiRequests.createPayOSPayment,
  });
};
