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
import { useGetSubscriptionList } from "@/hooks/useSubscription";
import { useAuthStore } from "@/stores/auth.store";
import {
  IconBuildingStore,
  IconCalendar,
  IconCreditCard,
  IconPackages,
  IconPlus,
  IconStar,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const { data: subscriptionsData, isLoading } = useGetSubscriptionList({
    page: 1,
    limit: 10,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Chờ thanh toán", variant: "secondary" as const },
      PAID: { label: "Đã thanh toán", variant: "default" as const },
      ACTIVE: { label: "Đang hoạt động", variant: "default" as const },
      EXPIRED: { label: "Hết hạn", variant: "destructive" as const },
      CANCELLED: { label: "Đã hủy", variant: "destructive" as const },
    };

    return (
      statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        variant: "secondary" as const,
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Chào mừng {user?.name || "bạn"}!
          </h1>
          <p className="text-muted-foreground">
            Quản lý hệ thống QR Ordering của nhà hàng bạn một cách hiệu quả
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/plans">
            <IconPlus className="size-4 mr-2" />
            Đăng ký dịch vụ
          </Link>
        </Button>
      </div>

      {/* Quick Stats - Real data from subscriptions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhà hàng đang hoạt động</CardTitle>
            <IconBuildingStore className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionsData?.payload?.data?.filter(s => s.status === 'ACTIVE').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng: {subscriptionsData?.payload?.data?.length || 0} nhà hàng
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gói dịch vụ</CardTitle>
            <IconPackages className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionsData?.payload?.data?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Đang sử dụng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ thanh toán</CardTitle>
            <IconCreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionsData?.payload?.data?.filter(s => s.status === 'PENDING').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Cần xử lý
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
            <IconStar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {subscriptionsData?.payload?.data?.some(s => s.status === 'ACTIVE') ? 'Hoạt động' : 'Chưa kích hoạt'}
            </div>
            <p className="text-xs text-muted-foreground">
              Tình trạng chung
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconPackages className="size-5" />
                Gói dịch vụ của bạn
              </CardTitle>
              <CardDescription>
                Quản lý tất cả gói dịch vụ QR Ordering
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/plans">
                <IconPlus className="size-4 mr-2" />
                Thêm nhà hàng mới
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="space-y-3">
                    <div className="h-5 bg-muted animate-pulse rounded-md w-1/3" />
                    <div className="h-4 bg-muted animate-pulse rounded-md w-1/2" />
                    <div className="h-4 bg-muted animate-pulse rounded-md w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : subscriptionsData?.payload?.data?.length === 0 ? (
            <div className="text-center py-12">
              <IconBuildingStore className="size-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Chưa có nhà hàng nào
              </h3>
              <p className="text-muted-foreground mb-6">
                Bắt đầu bằng cách đăng ký gói dịch vụ cho nhà hàng đầu tiên của
                bạn
              </p>
              <Button asChild>
                <Link href="/plans">
                  <IconPlus className="size-4 mr-2" />
                  Đăng ký gói dịch vụ
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptionsData?.payload?.data?.map((subscription) => {
                const status = getStatusBadge(subscription.status);
                return (
                  <div
                    key={subscription.id}
                    className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconBuildingStore className="size-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">
                              {subscription.restaurantName}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {subscription.restaurantAddress}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <IconPackages className="size-4" />
                            <span>{subscription.servicePlan?.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <IconCreditCard className="size-4" />
                            <span>
                              {formatCurrency(
                                subscription.servicePlan?.price || 0
                              )}
                              /tháng
                            </span>
                          </div>
                          {subscription.endDate && (
                            <div className="flex items-center gap-1">
                              <IconCalendar className="size-4" />
                              <span>
                                Hết hạn:{" "}
                                {format(
                                  new Date(subscription.endDate),
                                  "dd/MM/yyyy",
                                  { locale: vi }
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/customer/subscription?id=${subscription.id}`}
                            >
                              Quản lý
                            </Link>
                          </Button>
                          {subscription.status === "PENDING" && (
                            <Button size="sm" asChild>
                              <Link
                                href={`/checkout?planId=${subscription.servicePlanId}`}
                              >
                                Thanh toán
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-sm">Xem báo cáo doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start p-0">
              <IconTrendingUp className="size-4 mr-2" />
              Báo cáo chi tiết
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-sm">Quản lý đánh giá</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              className="w-full justify-start p-0"
              asChild
            >
              <Link href="/customer/reviews">
                <IconStar className="size-4 mr-2" />
                Xem đánh giá
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-sm">Lịch sử thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              className="w-full justify-start p-0"
              asChild
            >
              <Link href="/customer/payments">
                <IconCreditCard className="size-4 mr-2" />
                Xem lịch sử
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
