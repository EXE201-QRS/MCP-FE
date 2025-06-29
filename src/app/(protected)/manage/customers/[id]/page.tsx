"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetUser } from "@/hooks/useUser";
import {
  IconArrowLeft,
  IconCalendar,
  IconEdit,
  IconMail,
  IconPhone,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = Number(params.id);

  const { data, isLoading, error } = useGetUser({
    id: customerId,
    enabled: !!customerId,
  });

  const customer = data?.payload;

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded-md w-1/3" />
          <div className="grid gap-6">
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="h-32 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-destructive mb-2">
                Không thể tải thông tin khách hàng
              </div>
              <Button asChild>
                <Link href="/manage/customers">
                  <IconArrowLeft className="size-4 mr-2" />
                  Quay lại danh sách
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/manage/customers">
              <IconArrowLeft className="size-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chi tiết khách hàng
            </h1>
            <p className="text-muted-foreground">
              Thông tin chi tiết và lịch sử hoạt động
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/manage/customers/${customerId}/edit`}>
            <IconEdit className="size-4 mr-2" />
            Chỉnh sửa
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Profile */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUser className="size-5" />
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center text-center space-y-3">
              <Avatar className="size-20">
                <AvatarImage src={customer.avatar || ""} />
                <AvatarFallback className="text-lg">
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {customer.name || "Chưa cập nhật"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  ID: {customer.id}
                </p>
              </div>
              <Badge variant="secondary">
                {customer.roleName === "CUSTOMER" ? "Khách hàng" : customer.roleName}
              </Badge>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <IconMail className="size-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm font-mono text-muted-foreground">
                    {customer.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <IconPhone className="size-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Số điện thoại</p>
                  <p className="text-sm font-mono text-muted-foreground">
                    {customer.phoneNumber || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <IconCalendar className="size-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Ngày tham gia</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(customer.createdAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <IconCalendar className="size-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Cập nhật gần nhất</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(customer.updatedAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <IconUsers className="size-4 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">Đăng ký dịch vụ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <IconUsers className="size-4 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">Thanh toán</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <IconUsers className="size-4 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">Đánh giá</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>
                Lịch sử hoạt động và giao dịch của khách hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <IconUsers className="size-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Chưa có hoạt động nào
                </h3>
                <p className="text-muted-foreground text-sm">
                  Khách hàng chưa có hoạt động đăng ký dịch vụ hoặc thanh toán nào
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Audit Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin kiểm toán</CardTitle>
              <CardDescription>
                Lịch sử thay đổi và quản lý tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Người tạo:</span>
                  <span>{customer.createdById ? `User ID: ${customer.createdById}` : "Hệ thống"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Người cập nhật:</span>
                  <span>{customer.updatedById ? `User ID: ${customer.updatedById}` : "Chưa có"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge variant={customer.deletedAt ? "destructive" : "default"}>
                    {customer.deletedAt ? "Đã xóa" : "Hoạt động"}
                  </Badge>
                </div>
                {customer.deletedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày xóa:</span>
                    <span className="text-destructive">
                      {format(new Date(customer.deletedAt), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
