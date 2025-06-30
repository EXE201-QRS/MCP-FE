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

// Hook to get QOS health for a subscription - useful for create/edit forms
export const useSubscriptionWithQosHealth = (subscriptionId: number) => {
  return useQuery({
    queryKey: ["subscription-with-qos", subscriptionId],
    queryFn: () => subscriptionApiRequests.getQosHealth(subscriptionId),
    enabled: !!subscriptionId,
  });
};

export const useGetSubscriptionQosHealth = ({
  id,
  enabled = true,
}: {
  id: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["subscription-qos-health", id],
    queryFn: () => subscriptionApiRequests.getQosHealth(id),
    enabled: enabled && !!id,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time data
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
      // Invalidate all subscription-related queries using predicate matching
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return key?.includes('subscription') || key?.includes('admin-subscription');
        },
      });
    },
  });
};

export const useUpdateSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateSubscriptionBodyType & { id: number }) =>
      subscriptionApiRequests.updateSubscription(id, body),
    onSuccess: (data, variables) => {
      // Invalidate all subscription-related queries using pattern matching
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return key?.includes('subscription') || key?.includes('admin-subscription');
        },
      });
    },
  });
};

export const useDeleteSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApiRequests.deleteSubscription,
    onSuccess: () => {
      // Invalidate all subscription-related queries using pattern matching
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return key?.includes('subscription') || key?.includes('admin-subscription');
        },
      });
    },
  });
};
