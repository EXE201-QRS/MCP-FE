"use client";

import {
  IconCheck,
  IconClock,
  IconCreditCard,
  IconDownload,
  IconX,
  IconReceipt,
} from "@tabler/icons-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetSubscriptionList } from "@/hooks/useSubscription";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PAID":
      return (
        <Badge variant="default" className="bg-green-500 text-white">
          <IconCheck className="mr-1 h-3 w-3" />
          Đã thanh toán
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="secondary">
          <IconClock className="mr-1 h-3 w-3" />
          Chờ thanh toán
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="destructive">
          <IconX className="mr-1 h-3 w-3" />
          Thất bại
        </Badge>
      );
    case "ACTIVE":
      return (
        <Badge variant="default" className="bg-blue-500 text-white">
          <IconCheck className="mr-1 h-3 w-3" />
          Đang hoạt động
        </Badge>
      );
    case "EXPIRED":
      return (
        <Badge variant="destructive">
          <IconX className="mr-1 h-3 w-3" />
          Hết hạn
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="destructive">
          <IconX className="mr-1 h-3 w-3" />
          Đã hủy
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function CustomerPaymentsPage() {
  const { data: subscriptionsData, isLoading } = useGetSubscriptionList({
    page: 1,
    limit: 50, // Get more records for payment history
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Calculate totals from real data
  const paidSubscriptions = subscriptionsData?.payload?.data?.filter(
    (s) => s.status === "PAID" || s.status === "ACTIVE"
  ) || [];
  
  const totalPaid = paidSubscriptions.reduce(
    (sum, s) => sum + (s.servicePlan?.price || 0),
    0
  );

  const pendingSubscriptions = subscriptionsData?.payload?.data?.filter(
    (s) => s.status === "PENDING"
  ) || [];

  const nextPayment = pendingSubscriptions[0];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Lịch sử thanh toán
        </h1>
        <p className="text-muted-foreground">
          Quản lý và theo dõi các giao dịch thanh toán của bạn
        </p>
      </div>

      {/* Payment Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng đã thanh toán
            </CardTitle>
            <IconCreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalPaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              {paidSubscriptions.length} giao dịch thành công
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Thanh toán chờ xử lý
            </CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingSubscriptions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {nextPayment 
                ? formatCurrency(nextPayment.servicePlan?.price || 0)
                : 'Không có'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phương thức</CardTitle>
            <IconCreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PayOS</div>
            <p className="text-xs text-muted-foreground">Chuyển khoản ngân hàng</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Phương thức thanh toán</CardTitle>
          <CardDescription>
            Thông tin thanh toán được xử lý qua PayOS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <IconCreditCard className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">PayOS - Chuyển khoản ngân hàng</p>
                <p className="text-sm text-muted-foreground">
                  Thanh toán an toàn qua ngân hàng
                </p>
              </div>
            </div>
            <Badge variant="default">Mặc định</Badge>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/customer/dashboard">
                Đăng ký gói mới
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử đăng ký</CardTitle>
          <CardDescription>
            Danh sách tất cả gói dịch vụ đã đăng ký
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : subscriptionsData?.payload?.data?.length === 0 ? (
            <div className="text-center py-12">
              <IconReceipt className="size-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Chưa có giao dịch nào
              </h3>
              <p className="text-muted-foreground mb-6">
                Bạn chưa đăng ký gói dịch vụ nào. Hãy bắt đầu với gói đầu tiên!
              </p>
              <Button asChild>
                <Link href="/customer/dashboard">
                  Đăng ký gói dịch vụ
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
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
                {subscriptionsData?.payload?.data?.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
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
                      {format(new Date(subscription.createdAt), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </TableCell>
                    <TableCell>
                      {subscription.endDate ? (
                        format(new Date(subscription.endDate), "dd/MM/yyyy", {
                          locale: vi,
                        })
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(subscription.servicePlan?.price || 0)}
                    </TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell>
                      {subscription.status === "PENDING" ? (
                        <Button size="sm" asChild>
                          <Link href={`/checkout?planId=${subscription.servicePlanId}`}>
                            Thanh toán
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          <IconDownload className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
