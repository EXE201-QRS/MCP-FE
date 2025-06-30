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
import { useGetAdminSubscriptionList } from "@/hooks/useSubscription";
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
import { useState } from "react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: subscriptionsData,
    isLoading,
    refetch,
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

  // Filter data based on search and status
  const filteredSubscriptions =
    subscriptionsData?.payload?.data?.filter((subscription) => {
      const matchesSearch =
        subscription.restaurantName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        subscription.user?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        subscription.servicePlan?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || subscription.status === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  // Calculate statistics
  const totalSubscriptions = subscriptionsData?.payload?.data?.length || 0;
  const activeSubscriptions =
    subscriptionsData?.payload?.data?.filter((s) => s.status === "ACTIVE")
      .length || 0;
  const pendingSubscriptions =
    subscriptionsData?.payload?.data?.filter((s) => s.status === "PENDING")
      .length || 0;
  const totalRevenue =
    subscriptionsData?.payload?.data?.reduce((sum, s) => {
      return s.status === "PAID" || s.status === "ACTIVE"
        ? sum + (s.servicePlan?.price || 0)
        : sum;
    }, 0) || 0;

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
        <Button onClick={() => refetch()} variant="outline">
          <IconRefresh className="size-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đăng ký</CardTitle>
            <IconPackages className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả đăng ký dịch vụ
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
              {activeSubscriptions}
            </div>
            <p className="text-xs text-muted-foreground">
              Nhà hàng đang sử dụng
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
              {pendingSubscriptions}
            </div>
            <p className="text-xs text-muted-foreground">Cần xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <IconTrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Từ đăng ký đã thanh toán
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="size-5" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên nhà hàng, email khách hàng, gói dịch vụ..."
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
          <CardTitle>Danh sách đăng ký</CardTitle>
          <CardDescription>
            {filteredSubscriptions.length} kết quả
            {searchTerm && ` cho "${searchTerm}"`}
            {statusFilter !== "all" && ` với trạng thái "${statusFilter}"`}
          </CardDescription>
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
                {searchTerm || statusFilter !== "all"
                  ? "Không tìm thấy kết quả"
                  : "Chưa có đăng ký nào"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Đăng ký đầu tiên sẽ xuất hiện ở đây"}
              </p>
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
                          /tháng
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
