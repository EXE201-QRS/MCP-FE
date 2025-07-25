import reviewApiRequests from "@/apiRequests/review";
import {
  AdminResponseReviewBodyType,
  GetReviewQueryType,
  UpdateReviewBodyType,
} from "@/schemaValidations/review.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetReviewList = (params?: Partial<GetReviewQueryType>) => {
  const defaultParams: GetReviewQueryType = {
    page: 1,
    limit: 10,
    ...params,
  };

  return useQuery({
    queryKey: ["reviews", defaultParams],
    queryFn: () => reviewApiRequests.list(defaultParams),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetPublicReviews = (params?: Partial<GetReviewQueryType>) => {
  const defaultParams: GetReviewQueryType = {
    page: 1,
    limit: 10,
    isPublic: true,
    ...params,
  };

  return useQuery({
    queryKey: ["reviews", "public", defaultParams],
    queryFn: () => reviewApiRequests.getPublicReviews(defaultParams),
    staleTime: 1000 * 60 * 10, // 10 minutes for public reviews
  });
};

export const useGetPendingReviews = (params?: Partial<GetReviewQueryType>) => {
  const defaultParams: GetReviewQueryType = {
    page: 1,
    limit: 10,
    ...params,
  };

  return useQuery({
    queryKey: ["reviews", "pending", defaultParams],
    queryFn: () => reviewApiRequests.getPendingReviews(defaultParams),
    staleTime: 1000 * 60 * 2, // 2 minutes for pending reviews
  });
};

export const useGetReview = ({
  id,
  enabled = true,
}: {
  id: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewApiRequests.getReview(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewApiRequests.addReview,
    onSuccess: () => {
      // Invalidate all review queries
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
  });
};

export const useUpdateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateReviewBodyType & { id: number }) =>
      reviewApiRequests.updateReview(id, body),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      // Invalidate specific review
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.id],
      });
    },
  });
};

export const useAdminResponseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: AdminResponseReviewBodyType & { id: number }) =>
      reviewApiRequests.adminResponse(id, body),
    onSuccess: (_, variables) => {
      // Invalidate all review queries since admin response affects multiple lists
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      // Invalidate specific review
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.id],
      });
    },
  });
};

export const useTogglePublicMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewApiRequests.togglePublic(id),
    onSuccess: (_, id) => {
      // Invalidate all review queries
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      // Invalidate specific review
      queryClient.invalidateQueries({
        queryKey: ["reviews", id],
      });
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewApiRequests.deleteReview,
    onSuccess: (_, id) => {
      // Invalidate all review queries
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      // Remove specific review from cache
      queryClient.removeQueries({
        queryKey: ["reviews", id],
      });
    },
  });
};

// Hook for getting comprehensive review statistics
export const useReviewStats = () => {
  return useQuery({
    queryKey: ["review-stats"],
    queryFn: async () => {
      // Lấy page đầu tiên với limit tối đa để biết totalItems
      const allReviewsResponse = await reviewApiRequests.list({ page: 1, limit: 100 });
      const publicReviewsResponse = await reviewApiRequests.getPublicReviews({ page: 1, limit: 100 });
      const pendingReviewsResponse = await reviewApiRequests.getPendingReviews({ page: 1, limit: 100 });
      
      return {
        totalReviews: allReviewsResponse.payload?.totalItems || 0,
        publicReviews: publicReviewsResponse.payload?.totalItems || 0,
        pendingReviews: pendingReviewsResponse.payload?.totalItems || 0,
      };
    },
    // Cache cho 2 phút vì thống kê không cần realtime
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Hook for review filters
export const useReviewFilters = () => {
  const queryClient = useQueryClient();

  const clearCache = () => {
    queryClient.invalidateQueries({
      queryKey: ["reviews"],
    });
  };

  const prefetchReviews = (params: GetReviewQueryType) => {
    queryClient.prefetchQuery({
      queryKey: ["reviews", params],
      queryFn: () => reviewApiRequests.list(params),
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    clearCache,
    prefetchReviews,
  };
};
