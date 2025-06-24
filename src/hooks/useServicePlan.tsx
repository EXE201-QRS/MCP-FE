import servicePlanApiRequests from "@/apiRequests/service-plan";
import { UpdateServicePlanBodyType } from "@/schemaValidations/service-plan.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetServicePlanList = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["service-plans", params],
    queryFn: () => servicePlanApiRequests.list(params),
  });
};

export const useGetServicePlan = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["service-plans", id],
    queryFn: () => servicePlanApiRequests.getServicePlan(id),
    enabled,
  });
};

export const useAddServicePlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: servicePlanApiRequests.addServicePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["service-plans"],
      });
    },
  });
};

export const useUpdateServicePlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateServicePlanBodyType & { id: number }) =>
      servicePlanApiRequests.updateServicePlan(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["service-plans"],
      });
    },
  });
};

export const useDeleteServicePlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: servicePlanApiRequests.deleteServicePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["service-plans"],
      });
    },
  });
};
