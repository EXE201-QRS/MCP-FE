"use client";

import { PageSizeSelector } from "@/components/common/page-size-selector";
import {
  PaginationControls,
  PaginationInfo,
} from "@/components/common/pagination-controls";
import {
  ReviewStatusBadge,
  ReviewTypeBadge,
  StarRating,
} from "@/components/review";
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
import { useClientFilter, usePagination } from "@/hooks/usePagination";
import {
  useAdminResponseMutation,
  useGetReviewList,
  useReviewStats,
  useTogglePublicMutation,
} from "@/hooks/useReview";
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
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useMemo, useState } from "react";
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
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);

  // Use pagination hook
  const { currentPage, pageSize, handlePageChange, handlePageSizeChange } =
    usePagination({
      initialPage: 1,
      initialPageSize: 10,
    });

  // Hooks - Global stats
  const {
    data: globalStats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useReviewStats();

  const togglePublicMutation = useTogglePublicMutation();

  const {
    data: reviewsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetReviewList({
    page: currentPage,
    limit: pageSize,
    ...(statusFilter !== "all" && { status: statusFilter as any }),
    ...(reviewForFilter !== "all" && { reviewFor: reviewForFilter as any }),
    ...(ratingFilter !== "all" &&
      !isNaN(parseInt(ratingFilter)) && { rating: parseInt(ratingFilter) }),
    ...(searchTerm && searchTerm.trim() && { search: searchTerm.trim() }),
  });

  // Client-side filtering for current page data
  const rawData = reviewsData?.payload?.data || [];
  const filteredReviews = useClientFilter({
    data: rawData,
    searchTerm,
    statusFilter,
    searchFields: ["content", "user.name", "subscription.restaurantName"],
    statusField: "status",
  });

  // Calculate average rating from current page data
  const currentPageStats = useMemo(() => {
    const avgRating =
      rawData.length > 0
        ? (
            rawData.reduce((sum, r) => sum + r.rating, 0) / rawData.length
          ).toFixed(1)
        : "0.0";

    return {
      averageRating: avgRating,
      totalCurrentPage: rawData.length,
    };
  }, [rawData]);

  const handleRefresh = async () => {
    try {
      // Refresh cả dữ liệu trang và thống kê
      await Promise.all([refetch(), refetchStats()]);
      toast.success("Đã cập nhật dữ liệu thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải dữ liệu");
    }
  };

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

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setReviewForFilter("all");
    setRatingFilter("all");
  };

  // Pagination data from API response
  const paginationData = reviewsData?.payload
    ? {
        currentPage: reviewsData.payload.page,
        totalPages: reviewsData.payload.totalPages,
        totalItems: reviewsData.payload.totalItems,
        limit: reviewsData.payload.limit,
      }
    : {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: pageSize,
      };

  const hasFilters =
    searchTerm ||
    statusFilter !== "all" ||
    reviewForFilter !== "all" ||
    ratingFilter !== "all";
  const showingFiltered =
    hasFilters && filteredReviews.length !== rawData.length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý đánh giá
          </h1>
          <p className="text-muted-foreground">
            Quản lý và phản hồi đánh giá từ khách hàng
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={isFetching || isLoadingStats}
        >
          <IconRefresh
            className={`size-4 mr-2 ${isFetching || isLoadingStats ? "animate-spin" : ""}`}
          />
          {isFetching || isLoadingStats ? "Đang tải..." : "Làm mới"}
        </Button>
      </div>

      {/* Global Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
            <IconMessageCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                globalStats?.totalReviews || 0
              )}
            </div>
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
              {isLoadingStats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                globalStats?.pendingReviews || 0
              )}
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
              {isLoadingStats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                globalStats?.publicReviews || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Đang hiển thị trên trang chủ
            </p>
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
            <div className="text-2xl font-bold text-blue-600">
              {currentPageStats.averageRating}
            </div>
            <p className="text-xs text-muted-foreground">
              Điểm đánh giá (trang này)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconFilter className="size-5" />
              <CardTitle>Bộ lọc và tìm kiếm</CardTitle>
            </div>
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Tìm theo nội dung, tên khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
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
              <Label htmlFor="reviewFor">Loại đánh giá</Label>
              <Select
                value={reviewForFilter}
                onValueChange={setReviewForFilter}
              >
                <SelectTrigger id="reviewFor">
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
              <Label htmlFor="rating">Điểm đánh giá</Label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger id="rating">
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách đánh giá</CardTitle>
              <CardDescription>
                {showingFiltered ? (
                  <>
                    Hiển thị {filteredReviews.length} / {rawData.length} kết quả
                    trên trang này
                    {searchTerm && ` cho "${searchTerm}"`}
                  </>
                ) : (
                  <>{filteredReviews.length} kết quả trên trang này</>
                )}
              </CardDescription>
            </div>
            {/* Page Size Selector ở góc phải */}
            {!isLoading && paginationData.totalItems > 0 && (
              <PageSizeSelector
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                options={[5, 10, 20, 50]}
                disabled={isFetching}
              />
            )}
          </div>
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
                {hasFilters ? "Không tìm thấy kết quả" : "Chưa có đánh giá nào"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {hasFilters
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Đánh giá đầu tiên sẽ xuất hiện ở đây"}
              </p>
              {hasFilters && (
                <Button onClick={handleClearFilters} variant="outline">
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
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
                          <p className="text-sm line-clamp-2">
                            {review.content}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <ReviewTypeBadge reviewFor={review.reviewFor} />
                      </TableCell>

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

                      <TableCell>
                        <ReviewStatusBadge status={review.status} />
                      </TableCell>

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

              {/* Pagination info và navigation trong table */}
              {!isLoading && paginationData.totalItems > 0 && (
                <div className="border-t pt-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <PaginationInfo
                        currentPage={paginationData.currentPage}
                        totalPages={paginationData.totalPages}
                        totalItems={paginationData.totalItems}
                        limit={paginationData.limit}
                        itemName="đánh giá"
                      />
                      {hasFilters && (
                        <div className="text-sm text-orange-600">
                          Lọc: {filteredReviews.length} kết quả
                        </div>
                      )}
                    </div>
                    <div>
                      {paginationData.totalPages > 1 && (
                        <PaginationControls
                          currentPage={paginationData.currentPage}
                          totalPages={paginationData.totalPages}
                          onPageChange={handlePageChange}
                          disabled={isFetching}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
