"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAdminSubscriptionList,
  useSubscriptionStats,
} from "@/hooks/useSubscription";
import {
  IconBuildingStore,
  IconCreditCard,
  IconEye,
  IconPackages,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";

import data from "./data.json";

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

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useSubscriptionStats();
  const { data: recentSubscriptions, isLoading: subscriptionsLoading } =
    useGetAdminSubscriptionList({
      page: 1,
      limit: 5, // Get recent 5 subscriptions
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Enhanced Stats Cards with Real Data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đăng ký</CardTitle>
            <IconPackages className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.total || 0}
            </div>
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
              {statsLoading ? "..." : stats?.active || 0}
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
              {statsLoading ? "..." : stats?.pending || 0}
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
              {statsLoading ? "..." : formatCurrency(stats?.revenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Từ đăng ký đã thanh toán
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Subscriptions */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Đăng ký gần đây</CardTitle>
                <p className="text-sm text-muted-foreground">
                  5 đăng ký mới nhất trong hệ thống
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/manage/subscriptions">Xem tất cả</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {subscriptionsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-muted animate-pulse rounded-md"
                  />
                ))}
              </div>
            ) : recentSubscriptions?.payload?.data?.length === 0 ? (
              <div className="text-center py-8">
                <IconPackages className="size-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Chưa có đăng ký nào</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Nhà hàng</TableHead>
                    <TableHead>Gói dịch vụ</TableHead>
                    <TableHead>Ngày đăng ký</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSubscriptions?.payload?.data?.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {subscription.user?.name || "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {subscription.user?.email || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {subscription.restaurantName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {subscription.servicePlan?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(
                          new Date(subscription.createdAt),
                          "dd/MM/yyyy",
                          {
                            locale: vi,
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(subscription.status)}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/manage/subscriptions/${subscription.id}`}
                          >
                            <IconEye className="size-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Existing Charts */}
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3 px-4 lg:px-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-sm">Quản lý đăng ký</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              className="w-full justify-start p-0"
              asChild
            >
              <Link href="/manage/subscriptions">
                <IconPackages className="size-4 mr-2" />
                Xem tất cả đăng ký
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-sm">Quản lý thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              className="w-full justify-start p-0"
              asChild
            >
              <Link href="/manage/payments">
                <IconCreditCard className="size-4 mr-2" />
                Xem giao dịch
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-sm">Gói dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              className="w-full justify-start p-0"
              asChild
            >
              <Link href="/manage/service-plans">
                <IconUsers className="size-4 mr-2" />
                Quản lý gói
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <DataTable data={data} />
    </div>
  );
}
