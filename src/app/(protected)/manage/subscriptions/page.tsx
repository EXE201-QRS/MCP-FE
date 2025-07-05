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
import { Input } from "@/components/ui/input";
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
import { PaginationControls, PaginationInfo } from "@/components/common/pagination-controls";
import { PageSizeSelector } from "@/components/common/page-size-selector";
import { useGetAdminSubscriptionList, useSubscriptionStats } from "@/hooks/useSubscription";
import { usePagination, useClientFilter } from "@/hooks/usePagination";
import {
  IconBuildingStore,
  IconCreditCard,
  IconEye,
  IconFilter,
  IconPackages,
  IconRefresh,
  IconSearch,
  IconTrendingUp,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useState, useMemo } from "react";
import { toast } from "sonner";

const getStatusBadge = (status: string) => {
  const statusConfig = {
    PENDING: {
      label: "Chờ thanh toán",
      variant: "secondary" as const,
      className:
        "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400",
    },
    PAID: {
      label: "Đã thanh toán",
      variant: "default" as const,
      className:
        "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400",
    },
    ACTIVE: {
      label: "Đang hoạt động",
      variant: "default" as const,
      className:
        "bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400",
    },
    EXPIRED: {
      label: "Hết hạn",
      variant: "destructive" as const,
      className: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400",
    },
    CANCELLED: {
      label: "Đã hủy",
      variant: "destructive" as const,
      className:
        "bg-gray-500/10 text-gray-700 border-gray-200 dark:text-gray-400",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    variant: "secondary" as const,
    className: "",
  };

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export default function AdminSubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Use pagination hook
  const {
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    resetPagination,
  } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  const {
    data: subscriptionsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetAdminSubscriptionList({
    page: currentPage,
    limit: pageSize,
  });

  // Lấy thống kê tổng quan của toàn hệ thống
  const {
    data: globalStats,
    isLoading: isLoadingStats,
    refetch: refetchStats
  } = useSubscriptionStats();

  // Client-side filtering for current page data
  const rawData = subscriptionsData?.payload?.data || [];
  const filteredSubscriptions = useClientFilter({
    data: rawData,
    searchTerm,
    statusFilter,
    searchFields: ['restaurantName', 'user.email', 'servicePlan.name'],
    statusField: 'status',
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Calculate statistics from current page data (for display purposes)
  const currentPageStats = useMemo(() => {
    return {
      totalSubscriptions: rawData.length,
      activeSubscriptions: rawData.filter((s) => s.status === "ACTIVE").length,
      pendingSubscriptions: rawData.filter((s) => s.status === "PENDING").length,
      totalRevenue: rawData.reduce((sum, s) => {
        return s.status === "PAID" || s.status === "ACTIVE"
          ? sum + (s.servicePlan?.price || 0)
          : sum;
      }, 0),
    };
  }, [rawData]);

  const handleRefresh = async () => {
    try {
      // Refresh cả dữ liệu trang và thống kê
      await Promise.all([refetch(), refetchStats()]);
      toast.success('Đã cập nhật dữ liệu thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Don't reset pagination for search to allow search within current page
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    // Don't reset pagination for filter to allow filter within current page
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  // Pagination data from API response
  const paginationData = subscriptionsData?.payload ? {
    currentPage: subscriptionsData.payload.page,
    totalPages: subscriptionsData.payload.totalPages,
    totalItems: subscriptionsData.payload.totalItems,
    limit: subscriptionsData.payload.limit,
  } : {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: pageSize,
  };

  const hasFilters = searchTerm || statusFilter !== "all";
  const showingFiltered = hasFilters && filteredSubscriptions.length !== rawData.length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý đăng ký dịch vụ
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý tất cả đăng ký dịch vụ của khách hàng
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          disabled={isFetching || isLoadingStats}
        >
          <IconRefresh className={`size-4 mr-2 ${isFetching || isLoadingStats ? 'animate-spin' : ''}`} />
          {isFetching || isLoadingStats ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </div>

      {/* Global Stats - Toàn hệ thống */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đăng ký</CardTitle>
            <IconPackages className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                globalStats?.total || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tất cả đăng ký trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <IconBuildingStore className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoadingStats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                globalStats?.active || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Nhà hàng đang sử dụng dịch vụ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chờ thanh toán
            </CardTitle>
            <IconCreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {isLoadingStats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                globalStats?.pending || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Cần xử lý thanh toán</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hết hạn</CardTitle>
            <IconPackages className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {isLoadingStats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                globalStats?.expired || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Cần gia hạn hoặc hủy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <IconTrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isLoadingStats ? (
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              ) : (
                formatCurrency(globalStats?.revenue || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Từ tất cả đăng ký đã thanh toán
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearFilters}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên nhà hàng, email khách hàng, gói dịch vụ..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                <SelectItem value="PAID">Đã thanh toán</SelectItem>
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="EXPIRED">Hết hạn</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách đăng ký</CardTitle>
              <CardDescription>
                {showingFiltered ? (
                  <>
                    Hiển thị {filteredSubscriptions.length} / {rawData.length} kết quả trên trang này
                    {searchTerm && ` cho "${searchTerm}"`}
                    {statusFilter !== "all" && ` với trạng thái "${statusFilter}"`}
                    <span className="text-orange-600"> (lọc client-side)</span>
                  </>
                ) : (
                  <>
                    {filteredSubscriptions.length} kết quả trên trang này
                  </>
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
                  className="h-16 bg-muted animate-pulse rounded-md"
                />
              ))}
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12">
              <IconPackages className="size-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {hasFilters
                  ? "Không tìm thấy kết quả"
                  : "Chưa có đăng ký nào"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {hasFilters
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Đăng ký đầu tiên sẽ xuất hiện ở đây"}
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
                    <TableHead>Gói dịch vụ</TableHead>
                    <TableHead>Ngày đăng ký</TableHead>
                    <TableHead>Thời hạn</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow
                      key={subscription.id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {subscription.user?.name || "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {subscription.user?.email || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {subscription.restaurantName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {subscription.restaurantType}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {subscription.servicePlan?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(
                            new Date(subscription.createdAt),
                            "dd/MM/yyyy",
                            {
                              locale: vi,
                            }
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(subscription.createdAt), "HH:mm", {
                            locale: vi,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {subscription.endDate ? (
                          <div className="text-sm">
                            {format(
                              new Date(subscription.endDate),
                              "dd/MM/yyyy",
                              {
                                locale: vi,
                              }
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          {formatCurrency(subscription.servicePlan?.price || 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          /{subscription.durationDays === 'ONE_MONTH' ? 'tháng' : 
                            subscription.durationDays === 'THREE_MONTHS' ? '3 tháng' : 
                            '6 tháng'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(subscription.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/manage/subscriptions/${subscription.id}`}
                            >
                              <IconEye className="size-4" />
                            </Link>
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
                        itemName="đăng ký"
                      />
                      {hasFilters && (
                        <div className="text-sm text-orange-600">
                          Lọc: {filteredSubscriptions.length} kết quả
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
    </div>
  );
}
