import subscriptionApiRequests from "@/apiRequests/subscription";
import { UpdateSubscriptionBodyType } from "@/schemaValidations/subscription.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetSubscriptionList = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["subscriptions", params],
    queryFn: () => subscriptionApiRequests.list(params),
  });
};

export const useGetSubscription = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["subscriptions", id],
    queryFn: () => subscriptionApiRequests.getSubscription(id),
    enabled,
  });
};

export const useAddSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApiRequests.addSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
    },
  });
};

export const useUpdateSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateSubscriptionBodyType & { id: number }) =>
      subscriptionApiRequests.updateSubscription(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
    },
  });
};

export const useDeleteSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApiRequests.deleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
    },
  });
};
