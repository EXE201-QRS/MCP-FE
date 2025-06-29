import userApiRequests from "@/apiRequests/user";
import { UpdateUserBodyType } from "@/schemaValidations/user.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUserList = (params?: {
  page?: number;
  limit?: number;
  role?: string;
}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userApiRequests.list(params),
  });
};

export const useGetUser = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userApiRequests.getUser(id),
    enabled,
  });
};

export const useAddUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApiRequests.addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateUserBodyType & { id: number }) =>
      userApiRequests.updateUser(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApiRequests.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
