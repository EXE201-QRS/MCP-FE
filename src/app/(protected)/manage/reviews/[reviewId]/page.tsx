"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating, ReviewStatusBadge, ReviewTypeBadge } from "@/components/review";
import { ReviewStatus } from "@/constants/review.constant";
import {
  useAdminResponseMutation,
  useGetReview,
  useTogglePublicMutation,
} from "@/hooks/useReview";
import { AdminResponseReviewBodyType } from "@/schemaValidations/review.model";
import {
  IconArrowLeft,
  IconEye,
  IconEyeOff,
  IconMessageCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AdminResponseDialogProps {
  review: any;
  isOpen: boolean;
  onClose: () => void;
}

const AdminResponseDialog = ({
  review,
  isOpen,
  onClose,
}: AdminResponseDialogProps) => {
  const [adminResponse, setAdminResponse] = useState(
    review?.adminResponse || ""
  );
  const [status, setStatus] = useState<"APPROVED" | "REJECTED">(
    review?.status === "APPROVED" ? "APPROVED" : "APPROVED"
  );
  const [isPublic, setIsPublic] = useState(review?.isPublic || true);

  const adminResponseMutation = useAdminResponseMutation();

  const handleSubmit = async () => {
    if (!adminResponse.trim()) {
      toast.error("Vui lòng nhập phản hồi");
      return;
    }

    try {
      const data: AdminResponseReviewBodyType & { id: number } = {
        id: review.id,
        adminResponse: adminResponse.trim(),
        status,
        isPublic,
      };

      await adminResponseMutation.mutateAsync(data);
      toast.success(
        status === "APPROVED"
          ? "Đã duyệt đánh giá thành công"
          : "Đã từ chối đánh giá"
      );
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý đánh giá");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Phản hồi đánh giá</DialogTitle>
          <DialogDescription>
            Phản hồi và duyệt/từ chối đánh giá từ khách hàng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Admin Response */}
          <div className="space-y-2">
            <Label htmlFor="adminResponse">Phản hồi của bạn</Label>
            <Textarea
              id="adminResponse"
              placeholder="Nhập phản hồi cho khách hàng..."
              rows={4}
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select value={status} onValueChange={setStatus as any}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVED">Duyệt</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Public */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="isPublic">Hiển thị công khai</Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={adminResponseMutation.isPending}
            >
              {adminResponseMutation.isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = parseInt(params.reviewId as string);

  const [responseDialogOpen, setResponseDialogOpen] = useState(false);

  // Hooks
  const {
    data: reviewData,
    isLoading,
    refetch,
    isFetching,
  } = useGetReview({
    id: reviewId,
    enabled: !!reviewId,
  });

  const togglePublicMutation = useTogglePublicMutation();

  const review = reviewData?.payload?.data;

  const handleTogglePublic = async () => {
    if (!review) return;

    try {
      await togglePublicMutation.mutateAsync(review.id);
      toast.success("Đã cập nhật trạng thái hiển thị");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded-md w-48" />
          <div className="h-32 bg-muted animate-pulse rounded-md" />
          <div className="h-20 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">
            Không tìm thấy đánh giá
          </h3>
          <p className="text-muted-foreground mb-4">
            Đánh giá này có thể đã bị xóa hoặc không tồn tại
          </p>
          <Button asChild>
            <Link href="/manage/reviews">Quay lại danh sách</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/manage/reviews">
              <IconArrowLeft className="size-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Chi tiết đánh giá #{review.id}
            </h1>
            <p className="text-muted-foreground">
              Xem và quản lý đánh giá từ khách hàng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={async () => {
              try {
                await refetch();
                toast.success("Đã cập nhật dữ liệu thành công!");
              } catch (error) {
                toast.error("Có lỗi xảy ra khi tải dữ liệu");
              }
            }}
            variant="outline"
            disabled={isFetching}
          >
            <IconRefresh
              className={`size-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            {isFetching ? "Đang tải..." : "Làm mới"}
          </Button>

          <Button
            variant="outline"
            onClick={handleTogglePublic}
            disabled={togglePublicMutation.isPending}
          >
            {review.isPublic ? (
              <IconEye className="size-4 mr-2" />
            ) : (
              <IconEyeOff className="size-4 mr-2" />
            )}
            {review.isPublic ? "Ẩn" : "Hiển thị"}
          </Button>

          <Button onClick={() => setResponseDialogOpen(true)}>
            <IconMessageCircle className="size-4 mr-2" />
            Phản hồi
          </Button>
        </div>
      </div>

      {/* Review Info */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Review */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <StarRating rating={review.rating} size="lg" />
                    <ReviewStatusBadge status={review.status} />
                    <ReviewTypeBadge reviewFor={review.reviewFor} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={review.isPublic ? "default" : "secondary"}>
                      {review.isPublic ? "Công khai" : "Riêng tư"}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(review.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Nội dung đánh giá</h3>
                <p className="text-sm leading-relaxed">{review.content}</p>
              </div>

              {review.adminResponse && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={review.responsedBy?.avatar || undefined}
                      />
                      <AvatarFallback>
                        {review.responsedBy?.name?.charAt(0) || "QOS"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          Phản hồi từ {review.responsedBy?.name || "QOS Team"}
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
                      <p className="text-sm text-muted-foreground">
                        {review.adminResponse}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user?.avatar || undefined} />
                  <AvatarFallback>
                    {review.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{review.user?.name || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">
                    {review.user?.email || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restaurant Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin nhà hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Tên nhà hàng</p>
                <p className="text-sm text-muted-foreground">
                  {review.subscription?.restaurantName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Loại hình</p>
                <p className="text-sm text-muted-foreground">
                  {review.subscription?.restaurantType || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Địa chỉ</p>
                <p className="text-sm text-muted-foreground">
                  {review.subscription?.restaurantAddress || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Số điện thoại</p>
                <p className="text-sm text-muted-foreground">
                  {review.subscription?.restaurantPhone || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Admin Response Dialog */}
      <AdminResponseDialog
        review={review}
        isOpen={responseDialogOpen}
        onClose={() => setResponseDialogOpen(false)}
      />
    </div>
  );
}
