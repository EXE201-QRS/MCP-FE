import qosInstanceApiRequests from "@/apiRequests/qos-instance";
import { UpdateQosInstanceBodyType } from "@/schemaValidations/qos-instance.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetQosInstanceList = (params?: {
  page?: number;
  limit?: number;
  role?: string;
}) => {
  return useQuery({
    queryKey: ["qos-instances", params],
    queryFn: () => qosInstanceApiRequests.list(params),
  });
};

export const useGetQosInstance = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["qos-instances", id],
    queryFn: () => qosInstanceApiRequests.getQosInstance(id),
    enabled,
  });
};

export const useAddQosInstanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: qosInstanceApiRequests.addQosInstance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["qos-instances"],
      });
    },
  });
};

export const useUpdateQosInstanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateQosInstanceBodyType & { id: number }) =>
      qosInstanceApiRequests.updateQosInstance(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["qos-instances"],
      });
    },
  });
};

export const useDeleteQosInstanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: qosInstanceApiRequests.deleteQosInstance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["qos-instances"],
      });
    },
  });
};
