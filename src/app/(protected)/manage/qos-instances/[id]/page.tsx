"use client";

import { QosHealthCard } from "@/components/qos-health/QosHealthCard";
import {
  DatabaseInfoCard,
  OverallServiceStatus,
  ServiceStatusIndicator,
} from "@/components/qos-status";
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
import { useGetQosInstance } from "@/hooks/useQosInstance";
import {
  IconArrowLeft,
  IconBuilding,
  IconCalendar,
  IconEdit,
  IconMapPin,
  IconPhone,
  IconServer,
  IconUser,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function QosInstanceDetailPage() {
  const params = useParams();
  const instanceId = Number(params.id);

  const { data, isLoading, error } = useGetQosInstance({
    id: instanceId,
    enabled: !!instanceId,
  });

  const instance = data?.payload.data;

  // Remove unused functions and variables since we're using new components
  const getInitials = (name: string | null) => {
    if (!name) return "R";
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
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted animate-pulse rounded-lg" />
              <div className="h-32 bg-muted animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !instance) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-destructive mb-2">
                Không thể tải thông tin QOS Instance
              </div>
              <Button asChild>
                <Link href="/manage/qos-instances">
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

  // Remove unused statusConfig and overallStatus since we use new components

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/manage/qos-instances">
              <IconArrowLeft className="size-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              QOS Instance Details
            </h1>
            <p className="text-muted-foreground">
              {instance.subscription.restaurantName}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/manage/qos-instances/${instanceId}/edit`}>
            <IconEdit className="size-4 mr-2" />
            Chỉnh sửa
          </Link>
        </Button>
      </div>

      {/* Overall Status Banner */}
      <OverallServiceStatus
        subscriptionId={instance.subscriptionId}
        compact={false}
        className="border"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Restaurant & Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBuilding className="size-5" />
              Thông tin nhà hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Restaurant Info */}
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarImage src={instance.user.avatar || ""} />
                <AvatarFallback>
                  {getInitials(instance.subscription.restaurantName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">
                  {instance.subscription.restaurantName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {instance.subscription.restaurantType}
                </p>
              </div>
            </div>

            <Separator />

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <IconMapPin className="size-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm">
                    {instance.subscription.restaurantAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IconPhone className="size-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-mono">
                    {instance.subscription.restaurantPhone}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Customer Info */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <IconUser className="size-4" />
                Khách hàng
              </h4>

              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={instance.user.avatar || ""} />
                  <AvatarFallback className="text-xs">
                    {getInitials(instance.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {instance.user.name || "Chưa cập nhật"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {instance.user.email}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <IconCalendar className="size-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Ngày tạo</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(instance.createdAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>

              {instance.deployedAt && (
                <div className="flex items-center gap-2">
                  <IconCalendar className="size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Ngày triển khai</p>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(instance.deployedAt),
                        "dd/MM/yyyy HH:mm",
                        { locale: vi }
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Services Status & URLs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Services Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconServer className="size-5" />
                Trạng thái Services
              </CardTitle>
              <CardDescription>
                Tình trạng hoạt động của các thành phần hệ thống (dựa trên
                health check)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Frontend Status */}
                <ServiceStatusIndicator
                  subscriptionId={instance.subscriptionId}
                  service="frontend"
                  showUrl={true}
                  compact={false}
                />

                {/* Backend Status */}
                <ServiceStatusIndicator
                  subscriptionId={instance.subscriptionId}
                  service="backend"
                  showUrl={true}
                  compact={false}
                />
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <strong>Lưu ý:</strong> Trạng thái được kiểm tra thông qua
                    health check thời gian thực
                  </p>
                  <p>Database không được kiểm tra trong phiên bản này</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database Info Card */}
          <DatabaseInfoCard
            subscriptionId={instance.subscriptionId}
            instance={{
              dbName: instance.dbName,
              dbSize: instance.dbSize,
              lastBackup: instance.lastBackup
                ? instance.lastBackup.toString()
                : null,
              statusDb: instance.statusDb,
            }}
          />

          {/* QOS Health Check - Real-time Data */}
          <QosHealthCard
            subscriptionId={instance.subscriptionId}
            qosInstanceId={instance.id}
          />

          {/* Server Information */}
          {instance.serverInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconServer className="size-5" />
                  Thông tin Server
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {instance.serverInfo}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Audit Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin kiểm toán</CardTitle>
              <CardDescription>
                Lịch sử thay đổi và quản lý instance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Người tạo:</span>
                  <span>
                    {instance.createdById
                      ? `User ID: ${instance.createdById}`
                      : "Hệ thống"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Người cập nhật:</span>
                  <span>
                    {instance.updatedById
                      ? `User ID: ${instance.updatedById}`
                      : "Chưa có"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Cập nhật lần cuối:
                  </span>
                  <span>
                    {format(new Date(instance.updatedAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge
                    variant={instance.deletedAt ? "destructive" : "default"}
                  >
                    {instance.deletedAt ? "Đã xóa" : "Hoạt động"}
                  </Badge>
                </div>
                {instance.deletedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày xóa:</span>
                    <span className="text-destructive">
                      {format(
                        new Date(instance.deletedAt),
                        "dd/MM/yyyy HH:mm",
                        { locale: vi }
                      )}
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
