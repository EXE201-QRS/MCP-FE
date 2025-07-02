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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { StarRating, ReviewStatusBadge, ReviewTypeBadge } from "@/components/review";
import { ReviewFor, ReviewStatus } from "@/constants/review.constant";
import {
  useAdminResponseMutation,
  useGetReviewList,
  useReviewStats,
  useTogglePublicMutation,
} from "@/hooks/useReview";
import { cn } from "@/lib/utils";
import { AdminResponseReviewBodyType } from "@/schemaValidations/review.model";
import {
  IconCheck,
  IconClock,
  IconEye,
  IconEyeOff,
  IconFilter,
  IconMessageCircle,
  IconRefresh,
  IconSearch,
  IconStar,
  IconThumbDown,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
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
          {/* Review Info */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Đánh giá từ {review?.user?.name}</h4>
              <StarRating rating={review?.rating || 0} />
            </div>
            <p className="text-sm text-muted-foreground">{review?.content}</p>
          </div>

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

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reviewForFilter, setReviewForFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const pageSize = 10;

  // Hooks
  const { totalReviews, publicReviews, pendingReviews } = useReviewStats();
  const togglePublicMutation = useTogglePublicMutation();

  const {
    data: reviewsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetReviewList({
    page: currentPage,
    limit: pageSize,
    status: statusFilter !== "all" ? (statusFilter as any) : undefined,
    reviewFor: reviewForFilter !== "all" ? (reviewForFilter as any) : undefined,
    rating: ratingFilter !== "all" ? parseInt(ratingFilter) : undefined,
    search: searchTerm || undefined,
  });

  // Filter data locally if needed
  const filteredReviews =
    reviewsData?.payload?.data?.filter((review) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          review.content.toLowerCase().includes(searchLower) ||
          review.user?.name?.toLowerCase().includes(searchLower) ||
          review.subscription?.restaurantName
            ?.toLowerCase()
            .includes(searchLower)
        );
      }
      return true;
    }) || [];

  const handleTogglePublic = async (reviewId: number) => {
    try {
      await togglePublicMutation.mutateAsync(reviewId);
      toast.success("Đã cập nhật trạng thái hiển thị");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật");
    }
  };

  const handleResponseClick = (review: any) => {
    setSelectedReview(review);
    setResponseDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý đánh giá</h1>
          <p className="text-muted-foreground">
            Quản lý và phản hồi đánh giá từ khách hàng
          </p>
        </div>
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
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
            <IconMessageCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả đánh giá nhận được
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
              {pendingReviews}
            </div>
            <p className="text-xs text-muted-foreground">Cần xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công khai</CardTitle>
            <IconUsers className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {publicReviews}
            </div>
            <p className="text-xs text-muted-foreground">
              Đang hiển thị trên trang chủ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
            <IconStar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredReviews.length > 0
                ? (
                    filteredReviews.reduce((sum, r) => sum + r.rating, 0) /
                    filteredReviews.length
                  ).toFixed(1)
                : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">Điểm đánh giá</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="size-5" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo nội dung, tên khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                  <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                  <SelectItem value="REJECTED">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Loại đánh giá</Label>
              <Select
                value={reviewForFilter}
                onValueChange={setReviewForFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="SERVICE">Dịch vụ</SelectItem>
                  <SelectItem value="PLATFORM">Nền tảng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Điểm đánh giá</Label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn điểm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="5">5 sao</SelectItem>
                  <SelectItem value="4">4 sao</SelectItem>
                  <SelectItem value="3">3 sao</SelectItem>
                  <SelectItem value="2">2 sao</SelectItem>
                  <SelectItem value="1">1 sao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đánh giá</CardTitle>
          <CardDescription>
            {filteredReviews.length} kết quả
            {searchTerm && ` cho "${searchTerm}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-muted animate-pulse rounded-md"
                />
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <IconMessageCircle className="size-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Không tìm thấy đánh giá nào
              </h3>
              <p className="text-muted-foreground">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Nhà hàng</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hiển thị</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {review.user?.name || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {review.user?.email || "N/A"}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {review.subscription?.restaurantName || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {review.subscription?.restaurantType || "N/A"}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <StarRating rating={review.rating} />
                    </TableCell>

                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-2">{review.content}</p>
                      </div>
                    </TableCell>

                    <TableCell><ReviewTypeBadge reviewFor={review.reviewFor} /></TableCell>

                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(review.createdAt), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(review.createdAt), "HH:mm", {
                          locale: vi,
                        })}
                      </div>
                    </TableCell>

                    <TableCell><ReviewStatusBadge status={review.status} /></TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublic(review.id)}
                        disabled={togglePublicMutation.isPending}
                      >
                        {review.isPublic ? (
                          <IconEye className="size-4 text-green-600" />
                        ) : (
                          <IconEyeOff className="size-4 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/manage/reviews/${review.id}`}>
                            <IconEye className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResponseClick(review)}
                        >
                          {review.status === "PENDING" ? (
                            <IconMessageCircle className="size-4" />
                          ) : review.adminResponse ? (
                            <IconCheck className="size-4" />
                          ) : (
                            <IconThumbDown className="size-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Admin Response Dialog */}
      {selectedReview && (
        <AdminResponseDialog
          review={selectedReview}
          isOpen={responseDialogOpen}
          onClose={() => {
            setResponseDialogOpen(false);
            setSelectedReview(null);
          }}
        />
      )}
    </div>
  );
}
