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

// Admin hook for getting all subscriptions
export const useGetAdminSubscriptionList = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["admin-subscriptions", params],
    queryFn: () => subscriptionApiRequests.adminListAll(params),
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

// Single subscription hook (without enabled parameter)
export const useSubscription = (id: number) => {
  return useQuery({
    queryKey: ["subscriptions", id],
    queryFn: () => subscriptionApiRequests.getSubscription(id),
    enabled: !!id,
  });
};

// Admin hook for subscription statistics
export const useSubscriptionStats = () => {
  return useQuery({
    queryKey: ["subscription-stats"],
    queryFn: async () => {
      const response = await subscriptionApiRequests.adminListAll({ page: 1, limit: 1000 });
      const subscriptions = response.payload?.data || [];
      
      return {
        total: subscriptions.length,
        active: subscriptions.filter(s => s.status === 'ACTIVE').length,
        pending: subscriptions.filter(s => s.status === 'PENDING').length,
        expired: subscriptions.filter(s => s.status === 'EXPIRED').length,
        revenue: subscriptions
          .filter(s => s.status === 'PAID' || s.status === 'ACTIVE')
          .reduce((sum, s) => sum + (s.servicePlan?.price || 0), 0),
      };
    },
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
