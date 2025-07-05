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

// Admin hook for subscription statistics - Get overview of entire system
export const useSubscriptionStats = () => {
  return useQuery({
    queryKey: ["subscription-stats"],
    queryFn: async () => {
      // Lấy tất cả subscription với limit tối đa để có thống kê đầy đủ
      const response = await subscriptionApiRequests.adminListAll({ page: 1, limit: 100 });
      const subscriptions = response.payload?.data || [];
      
      return {
        total: response.payload?.totalItems || 0, // Sử dụng totalItems từ API
        active: subscriptions.filter(s => s.status === 'ACTIVE').length,
        pending: subscriptions.filter(s => s.status === 'PENDING').length,
        paid: subscriptions.filter(s => s.status === 'PAID').length,
        expired: subscriptions.filter(s => s.status === 'EXPIRED').length,
        cancelled: subscriptions.filter(s => s.status === 'CANCELLED').length,
        revenue: subscriptions
          .filter(s => s.status === 'PAID' || s.status === 'ACTIVE')
          .reduce((sum, s) => sum + (s.servicePlan?.price || 0), 0),
        // Thêm thông tin chi tiết
        revenueThisMonth: subscriptions
          .filter(s => {
            const isActiveOrPaid = s.status === 'PAID' || s.status === 'ACTIVE';
            const createdThisMonth = new Date(s.createdAt).getMonth() === new Date().getMonth();
            return isActiveOrPaid && createdThisMonth;
          })
          .reduce((sum, s) => sum + (s.servicePlan?.price || 0), 0),
      };
    },
    // Cache cho 2 phút vì thống kê không cần realtime
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
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
