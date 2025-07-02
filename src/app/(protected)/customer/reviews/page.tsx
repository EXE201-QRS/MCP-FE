"use client";

import {
  ReviewStatusBadge,
  ReviewTypeBadge,
  StarRating,
} from "@/components/review";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ReviewFor } from "@/constants/review.constant";
import {
  useAddReviewMutation,
  useDeleteReviewMutation,
  useGetReviewList,
  useUpdateReviewMutation,
} from "@/hooks/useReview";
import { useGetSubscriptionList } from "@/hooks/useSubscription";
import {
  CreateReviewBodyType,
  UpdateReviewBodyType,
} from "@/schemaValidations/review.model";
import { useAuthStore } from "@/stores/auth.store";
import {
  IconClock,
  IconEdit,
  IconMessageCircle,
  IconPlus,
  IconRefresh,
  IconStar,
  IconTrash,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";

interface ReviewDialogProps {
  review?: any;
  isOpen: boolean;
  onClose: () => void;
  subscriptions: any[];
}

const ReviewDialog = ({
  review,
  isOpen,
  onClose,
  subscriptions,
}: ReviewDialogProps) => {
  const [formData, setFormData] = useState({
    subscriptionId: review?.subscriptionId || "",
    rating: review?.rating || 5,
    content: review?.content || "",
    reviewFor: review?.reviewFor || ReviewFor.SERVICE,
  });

  const addReviewMutation = useAddReviewMutation();
  const updateReviewMutation = useUpdateReviewMutation();
  const { user } = useAuthStore();

  const isEditing = !!review;

  const handleSubmit = async () => {
    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    if (!formData.subscriptionId) {
      toast.error("Vui lòng chọn nhà hàng để đánh giá");
      return;
    }

    try {
      if (isEditing) {
        const updateData: UpdateReviewBodyType & { id: number } = {
          id: review.id,
          userId: user?.id ?? 0,
          subscriptionId: parseInt(formData.subscriptionId),
          rating: formData.rating,
          content: formData.content.trim(),
          reviewFor: formData.reviewFor as any,
        };
        await updateReviewMutation.mutateAsync(updateData);
        toast.success("Đã cập nhật đánh giá thành công");
      } else {
        const createData: CreateReviewBodyType = {
          userId: user?.id ?? 0,
          subscriptionId: parseInt(formData.subscriptionId),
          rating: formData.rating,
          content: formData.content.trim(),
          reviewFor: formData.reviewFor as any,
        };
        await addReviewMutation.mutateAsync(createData);
        toast.success("Đã tạo đánh giá thành công");
      }
      onClose();
      // Reset form
      setFormData({
        subscriptionId: "",
        rating: 5,
        content: "",
        reviewFor: ReviewFor.SERVICE,
      });
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi xử lý đánh giá");
    }
  };

  // Filter active subscriptions for new reviews
  const availableSubscriptions = subscriptions.filter(
    (sub) => sub.status === "ACTIVE" || sub.status === "PAID"
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa đánh giá" : "Viết đánh giá mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật đánh giá của bạn"
              : "Chia sẻ trải nghiệm của bạn với dịch vụ QOS"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Subscription Selection */}
          {!isEditing && (
            <div className="space-y-2">
              <Label>Nhà hàng</Label>
              <Select
                value={formData.subscriptionId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, subscriptionId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhà hàng để đánh giá" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubscriptions.map((subscription) => (
                    <SelectItem
                      key={subscription.id}
                      value={subscription.id.toString()}
                    >
                      {subscription.restaurantName} -{" "}
                      {subscription.servicePlan?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Review For */}
          <div className="space-y-2">
            <Label>Loại đánh giá</Label>
            <Select
              value={formData.reviewFor}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, reviewFor: value as any }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ReviewFor.SERVICE}>Dịch vụ</SelectItem>
                <SelectItem value={ReviewFor.PLATFORM}>Nền tảng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Đánh giá</Label>
            <StarRating
              rating={formData.rating}
              interactive
              size="lg"
              onChange={(rating) =>
                setFormData((prev) => ({ ...prev, rating }))
              }
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              placeholder="Chia sẻ trải nghiệm chi tiết của bạn..."
              rows={5}
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                addReviewMutation.isPending || updateReviewMutation.isPending
              }
            >
              {addReviewMutation.isPending || updateReviewMutation.isPending
                ? "Đang xử lý..."
                : isEditing
                  ? "Cập nhật"
                  : "Gửi đánh giá"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function CustomerReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const pageSize = 10;

  // Hooks
  const { user } = useAuthStore();
  const deleteReviewMutation = useDeleteReviewMutation();

  // Get user's reviews
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
    isFetching: reviewsFetching,
  } = useGetReviewList({
    page: currentPage,
    limit: pageSize,
    userId: user?.id,
  });

  // Get user's subscriptions
  const { data: subscriptionsData, isLoading: subscriptionsLoading } =
    useGetSubscriptionList({
      page: 1,
      limit: 100, // Get all subscriptions for dropdown
    });

  const myReviews = reviewsData?.payload?.data || [];
  const mySubscriptions = subscriptionsData?.payload?.data || [];

  const handleEdit = (review: any) => {
    setSelectedReview(review);
    setDialogOpen(true);
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      return;
    }

    try {
      await deleteReviewMutation.mutateAsync(reviewId);
      toast.success("Đã xóa đánh giá thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa đánh giá");
    }
  };

  const handleCreateNew = () => {
    setSelectedReview(null);
    setDialogOpen(true);
  };

  if (reviewsLoading || subscriptionsLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Đánh giá của tôi
          </h1>
          <p className="text-muted-foreground">
            Chia sẻ trải nghiệm sử dụng dịch vụ QOS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={async () => {
              try {
                await refetchReviews();
                toast.success("Đã cập nhật dữ liệu thành công!");
              } catch (error) {
                toast.error("Có lỗi xảy ra khi tải dữ liệu");
              }
            }}
            variant="outline"
            disabled={reviewsFetching}
          >
            <IconRefresh
              className={`size-4 mr-2 ${reviewsFetching ? "animate-spin" : ""}`}
            />
            {reviewsFetching ? "Đang tải..." : "Làm mới"}
          </Button>

          <Button onClick={handleCreateNew}>
            <IconPlus className="mr-2 h-4 w-4" />
            Viết đánh giá
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
            <IconMessageCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myReviews.length}</div>
            <p className="text-xs text-muted-foreground">Đánh giá đã viết</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đánh giá trung bình
            </CardTitle>
            <IconStar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myReviews.length > 0
                ? (
                    myReviews.reduce((sum, r) => sum + r.rating, 0) /
                    myReviews.length
                  ).toFixed(1)
                : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Điểm đánh giá của bạn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <IconClock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {myReviews.filter((r) => r.status === "PENDING").length}
            </div>
            <p className="text-xs text-muted-foreground">Đang chờ xử lý</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {myReviews.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <IconMessageCircle className="size-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Chưa có đánh giá nào
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Hãy viết đánh giá đầu tiên về trải nghiệm sử dụng dịch vụ QOS
              </p>
              <Button onClick={handleCreateNew}>
                <IconPlus className="mr-2 h-4 w-4" />
                Viết đánh giá đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          myReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <StarRating rating={review.rating} />
                      <ReviewStatusBadge status={review.status} />
                      <ReviewTypeBadge reviewFor={review.reviewFor} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">
                        {review.subscription?.restaurantName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(
                          new Date(review.createdAt),
                          "dd/MM/yyyy HH:mm",
                          {
                            locale: vi,
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {review.status === "PENDING" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(review)}
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                      disabled={deleteReviewMutation.isPending}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{review.content}</p>

                {review.adminResponse && (
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={review.responsedBy?.avatar || undefined}
                        />
                        <AvatarFallback>QOS</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Phản hồi từ QOS Team
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {review.adminResponse}
                        </p>
                        {review.responsedAt && (
                          <p className="text-xs text-muted-foreground">
                            {format(
                              new Date(review.responsedAt),
                              "dd/MM/yyyy HH:mm",
                              { locale: vi }
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Review Dialog */}
      <ReviewDialog
        review={selectedReview}
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedReview(null);
        }}
        subscriptions={mySubscriptions}
      />
    </div>
  );
}
