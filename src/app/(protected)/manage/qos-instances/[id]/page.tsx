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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { QosInstanceStatus } from "@/constants/qos-instance.constant";
import { useGetQosInstance } from "@/hooks/useQosInstance";
import {
  IconActivity,
  IconAlertTriangle,
  IconArrowLeft,
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconClock,
  IconDatabase,
  IconEdit,
  IconExternalLink,
  IconLoader,
  IconMapPin,
  IconPhone,
  IconServer,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { HardDrive, Wrench } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const statusConfig = {
  [QosInstanceStatus.ACTIVE]: {
    icon: IconCheck,
    variant: "default" as const,
    label: "Hoạt động",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  [QosInstanceStatus.INACTIVE]: {
    icon: IconX,
    variant: "secondary" as const,
    label: "Không hoạt động",
    color: "text-gray-500",
    bgColor: "bg-gray-50 dark:bg-gray-950",
  },
  [QosInstanceStatus.MAINTENANCE]: {
    icon: Wrench,
    variant: "outline" as const,
    label: "Bảo trì",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
  },
  [QosInstanceStatus.DEPLOYING]: {
    icon: IconLoader,
    variant: "outline" as const,
    label: "Đang triển khai",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  [QosInstanceStatus.ERROR]: {
    icon: IconAlertTriangle,
    variant: "destructive" as const,
    label: "Lỗi",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950",
  },
};

export default function QosInstanceDetailPage() {
  const params = useParams();
  const instanceId = Number(params.id);

  const { data, isLoading, error } = useGetQosInstance({
    id: instanceId,
    enabled: !!instanceId,
  });

  const instance = data?.payload.data;

  const getInitials = (name: string | null) => {
    if (!name) return "R";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const StatusBadge = ({ status }: { status: keyof typeof statusConfig }) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <IconComponent className={`size-3 ${config.color}`} />
        {config.label}
      </Badge>
    );
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "0 MB";
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getOverallStatus = () => {
    if (!instance) return QosInstanceStatus.INACTIVE;
    const statuses = [instance.statusDb, instance.statusFE, instance.statusBE];

    if (statuses.includes(QosInstanceStatus.ERROR))
      return QosInstanceStatus.ERROR;
    if (statuses.includes(QosInstanceStatus.DEPLOYING))
      return QosInstanceStatus.DEPLOYING;
    if (statuses.includes(QosInstanceStatus.MAINTENANCE))
      return QosInstanceStatus.MAINTENANCE;
    if (statuses.every((s) => s === QosInstanceStatus.ACTIVE))
      return QosInstanceStatus.ACTIVE;
    return QosInstanceStatus.INACTIVE;
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

  const overallStatus = getOverallStatus();
  const statusInfo = statusConfig[overallStatus];

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
      <Card className={statusInfo.bgColor}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <statusInfo.icon className={`size-6 ${statusInfo.color}`} />
              <div>
                <h3 className="font-semibold">
                  Trạng thái tổng quan: {statusInfo.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  QOS Instance ID: {instance.id}
                </p>
              </div>
            </div>
            {instance.version && (
              <Badge variant="outline">v{instance.version}</Badge>
            )}
          </div>
        </CardContent>
      </Card>

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
                Tình trạng hoạt động của các thành phần hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {/* Database Status */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <IconDatabase className="size-4" />
                    <span className="font-medium">Database</span>
                  </div>
                  <StatusBadge status={instance.statusDb} />
                  <div className="space-y-1">
                    <p className="text-sm font-mono">
                      {instance.dbName || "Chưa cấu hình"}
                    </p>
                    {instance.dbSize && (
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(instance.dbSize)}
                      </p>
                    )}
                    {instance.lastBackup && (
                      <p className="text-xs text-muted-foreground">
                        Backup:{" "}
                        {format(new Date(instance.lastBackup), "dd/MM HH:mm", {
                          locale: vi,
                        })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Frontend Status */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <IconServer className="size-4" />
                    <span className="font-medium">Frontend</span>
                  </div>
                  <StatusBadge status={instance.statusFE} />
                  <div className="space-y-1">
                    {instance.frontEndUrl ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0"
                        asChild
                      >
                        <a
                          href={instance.frontEndUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="text-sm">
                            {instance.frontEndUrl}
                          </span>
                          <IconExternalLink className="size-3 ml-1" />
                        </a>
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Chưa cấu hình URL
                      </p>
                    )}
                  </div>
                </div>

                {/* Backend Status */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <IconServer className="size-4" />
                    <span className="font-medium">Backend</span>
                  </div>
                  <StatusBadge status={instance.statusBE} />
                  <div className="space-y-1">
                    {instance.backEndUrl ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0"
                        asChild
                      >
                        <a
                          href={instance.backEndUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="text-sm">{instance.backEndUrl}</span>
                          <IconExternalLink className="size-3 ml-1" />
                        </a>
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Chưa cấu hình URL
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconActivity className="size-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Thông số hiệu suất và độ tin cậy của hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Response Time */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconClock className="size-4 text-blue-500" />
                      <span className="font-medium">Response Time</span>
                    </div>
                    <span className="text-lg font-bold">
                      {instance.responseTime
                        ? `${instance.responseTime}ms`
                        : "N/A"}
                    </span>
                  </div>
                  {instance.responseTime && (
                    <div className="space-y-1">
                      <Progress
                        value={Math.min(
                          (instance.responseTime / 1000) * 100,
                          100
                        )}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {instance.responseTime < 200
                          ? "Tuyệt vời"
                          : instance.responseTime < 500
                            ? "Tốt"
                            : instance.responseTime < 1000
                              ? "Trung bình"
                              : "Cần cải thiện"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Uptime */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconActivity className="size-4 text-green-500" />
                      <span className="font-medium">Uptime</span>
                    </div>
                    <span className="text-lg font-bold">
                      {instance.uptime
                        ? `${instance.uptime.toFixed(1)}%`
                        : "N/A"}
                    </span>
                  </div>
                  {instance.uptime && (
                    <div className="space-y-1">
                      <Progress value={instance.uptime} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {instance.uptime >= 99.9
                          ? "Excellent"
                          : instance.uptime >= 99.5
                            ? "Good"
                            : instance.uptime >= 99.0
                              ? "Average"
                              : "Needs attention"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Last Ping */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconClock className="size-4 text-muted-foreground" />
                    <span className="font-medium">Last Ping</span>
                  </div>
                  <p className="text-sm">
                    {instance.lastPing
                      ? format(
                          new Date(instance.lastPing),
                          "dd/MM/yyyy HH:mm:ss",
                          { locale: vi }
                        )
                      : "Chưa có ping"}
                  </p>
                </div>

                {/* Database Size */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="size-4 text-muted-foreground" />
                    <span className="font-medium">Database Size</span>
                  </div>
                  <p className="text-sm">{formatBytes(instance.dbSize)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
