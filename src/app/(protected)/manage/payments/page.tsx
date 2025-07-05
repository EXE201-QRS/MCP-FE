"use client";

import { PageSizeSelector } from "@/components/common/page-size-selector";
import {
  PaginationControls,
  PaginationInfo,
} from "@/components/common/pagination-controls";
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
import { useClientFilter, usePagination } from "@/hooks/usePagination";
import {
  useGetAdminSubscriptionList,
  useSubscriptionStats,
} from "@/hooks/useSubscription";
import {
  IconCalendar,
  IconCreditCard,
  IconDownload,
  IconEye,
  IconFilter,
  IconRefresh,
  IconSearch,
  IconTrendingUp,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const getPaymentStatusBadge = (status: string) => {
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
    FAILED: {
      label: "Thất bại",
      variant: "destructive" as const,
      className: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400",
    },
    CANCELLED: {
      label: "Đã hủy",
      variant: "destructive" as const,
      className:
        "bg-gray-500/10 text-gray-700 border-gray-200 dark:text-gray-400",
    },
    EXPIRED: {
      label: "Hết hạn",
      variant: "destructive" as const,
      className: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400",
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

export default function AdminPaymentsPage() {
  const searchParams = useSearchParams();
  const subscriptionIdFilter = searchParams.get("subscriptionId");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

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
  } = useSubscriptionStats();

  const {
    data: subscriptionsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetAdminSubscriptionList({
    page: currentPage,
    limit: pageSize,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Transform subscriptions into payment transactions
  const paymentTransactions = useMemo(() => {
    if (!subscriptionsData?.payload?.data) return [];

    return subscriptionsData.payload.data.map((subscription) => ({
      id: `PAY-${subscription.id}`,
      subscriptionId: subscription.id,
      orderId: `ORD-${subscription.id}-${Date.now()}`,
      customerName: subscription.user?.name || "N/A",
      customerEmail: subscription.user?.email || "N/A",
      restaurantName: subscription.restaurantName,
      servicePlanName: subscription.servicePlan?.name || "N/A",
      amount: subscription.servicePlan?.price || 0,
      status: subscription.status,
      paymentMethod: "PayOS",
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
      subscription: subscription,
    }));
  }, [subscriptionsData]);

  // Client-side filtering for current page data
  const filteredTransactions = useClientFilter({
    data: paymentTransactions,
    searchTerm,
    statusFilter,
    searchFields: [
      "customerName",
      "customerEmail",
      "restaurantName",
      "servicePlanName",
      "orderId",
    ],
    statusField: "status",
  });

  // Additional date filtering (since useClientFilter doesn't handle dates)
  const dateFilteredTransactions = useMemo(() => {
    if (dateFilter === "all") return filteredTransactions;

    return filteredTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const now = new Date();

      switch (dateFilter) {
        case "today":
          return transactionDate.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return transactionDate >= monthAgo;
        default:
          return true;
      }
    });
  }, [filteredTransactions, dateFilter]);

  // Apply subscription ID filter if present
  const finalFilteredTransactions = useMemo(() => {
    if (!subscriptionIdFilter) return dateFilteredTransactions;

    return dateFilteredTransactions.filter(
      (transaction) =>
        transaction.subscriptionId.toString() === subscriptionIdFilter
    );
  }, [dateFilteredTransactions, subscriptionIdFilter]);

  // Calculate stats from global data instead of current page
  const globalPaymentStats = useMemo(() => {
    if (!globalStats) {
      return {
        totalTransactions: 0,
        successfulPayments: 0,
        pendingPayments: 0,
        totalRevenue: 0,
        averageTransaction: 0,
      };
    }

    const successfulPayments = globalStats.active + globalStats.paid;
    const averageTransaction =
      successfulPayments > 0 ? globalStats.revenue / successfulPayments : 0;

    return {
      totalTransactions: globalStats.total,
      successfulPayments,
      pendingPayments: globalStats.pending,
      totalRevenue: globalStats.revenue,
      averageTransaction,
    };
  }, [globalStats]);

  const handleRefresh = async () => {
    try {
      // Refresh cả dữ liệu trang và thống kê
      await Promise.all([refetch(), refetchStats()]);
      toast.success("Đã cập nhật dữ liệu thanh toán thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải dữ liệu");
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
  };

  // Pagination data from API response
  const paginationData = subscriptionsData?.payload
    ? {
        currentPage: subscriptionsData.payload.page,
        totalPages: subscriptionsData.payload.totalPages,
        totalItems: subscriptionsData.payload.totalItems,
        limit: subscriptionsData.payload.limit,
      }
    : {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: pageSize,
      };

  const hasFilters =
    searchTerm || statusFilter !== "all" || dateFilter !== "all";
  const showingFiltered =
    hasFilters &&
    finalFilteredTransactions.length !== paymentTransactions.length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý thanh toán
            {subscriptionIdFilter && (
              <span className="text-base font-normal text-muted-foreground ml-2">
                - Đăng ký #{subscriptionIdFilter}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý tất cả giao dịch thanh toán
          </p>
        </div>
        <div className="flex items-center gap-2">
          {subscriptionIdFilter && (
            <Button variant="outline" asChild>
              <Link href="/manage/payments">Xem tất cả</Link>
            </Button>
          )}
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
      </div>

      {/* Payment Statistics - Toàn hệ thống */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng giao dịch
            </CardTitle>
            <IconCreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                globalPaymentStats.totalTransactions
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tất cả giao dịch trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành công</CardTitle>
            <IconTrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoadingStats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                globalPaymentStats.successfulPayments
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {globalPaymentStats.totalTransactions > 0
                ? Math.round(
                    (globalPaymentStats.successfulPayments /
                      globalPaymentStats.totalTransactions) *
                      100
                  )
                : 0}
              % tỷ lệ thành công
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
            <IconCalendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {isLoadingStats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                globalPaymentStats.pendingPayments
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Cần theo dõi toàn hệ thống
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            <IconTrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isLoadingStats ? (
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              ) : (
                formatCurrency(globalPaymentStats.totalRevenue)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              TB: {formatCurrency(globalPaymentStats.averageTransaction)}
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
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo khách hàng, nhà hàng, mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                <SelectItem value="PAID">Đã thanh toán</SelectItem>
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="FAILED">Thất bại</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">7 ngày qua</SelectItem>
                <SelectItem value="month">30 ngày qua</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lịch sử giao dịch</CardTitle>
              <CardDescription>
                {showingFiltered ? (
                  <>
                    Hiển thị {finalFilteredTransactions.length} /{" "}
                    {paymentTransactions.length} kết quả trên trang này
                    {searchTerm && ` cho "${searchTerm}"`}
                  </>
                ) : (
                  <>{finalFilteredTransactions.length} kết quả trên trang này</>
                )}
              </CardDescription>
            </div>
            {/* Page Size Selector ở góc phải */}
            {!isLoading && paginationData.totalItems > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <IconDownload className="size-4 mr-2" />
                  Xuất Excel
                </Button>
                <PageSizeSelector
                  pageSize={pageSize}
                  onPageSizeChange={handlePageSizeChange}
                  options={[5, 10, 20, 50]}
                  disabled={isFetching}
                />
              </div>
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
          ) : finalFilteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <IconCreditCard className="size-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {hasFilters
                  ? "Không tìm thấy giao dịch"
                  : "Chưa có giao dịch nào"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {hasFilters
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Giao dịch đầu tiên sẽ xuất hiện ở đây"}
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
                    <TableHead>Mã giao dịch</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Nhà hàng</TableHead>
                    <TableHead>Gói dịch vụ</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalFilteredTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-mono text-sm">
                            {transaction.orderId}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Sub-{transaction.subscriptionId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {transaction.customerName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.customerEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {transaction.restaurantName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.servicePlanName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          {formatCurrency(transaction.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconCreditCard className="size-4 text-muted-foreground" />
                          <span className="text-sm">
                            {transaction.paymentMethod}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(
                            new Date(transaction.createdAt),
                            "dd/MM/yyyy",
                            {
                              locale: vi,
                            }
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(transaction.createdAt), "HH:mm", {
                            locale: vi,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/manage/subscriptions/${transaction.subscriptionId}`}
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
                        itemName="giao dịch"
                      />
                      {hasFilters && (
                        <div className="text-sm text-orange-600">
                          Lọc: {finalFilteredTransactions.length} kết quả
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
