"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSubscriptionQosHealth } from "@/hooks/useSubscription";
import {
  IconActivity,
  IconAlertTriangle,
  IconCheck,
  IconRefresh,
  IconServer,
  IconTable,
  IconUserCheck,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { HardDrive } from "lucide-react";

interface QosHealthCardProps {
  subscriptionId: number;
  qosInstanceId?: number;
  compact?: boolean;
}

export function QosHealthCard({
  subscriptionId,
  qosInstanceId,
  compact = false,
}: QosHealthCardProps) {
  const { data, isLoading, error, refetch } = useGetSubscriptionQosHealth({
    id: subscriptionId,
    enabled: !!subscriptionId,
  });

  const healthData = data?.payload?.data.healthCheck;
  const qosInstance = data?.payload?.data.qosInstance;

  const parseStorageValue = (storage: string | null) => {
    if (!storage) return { value: 0, unit: "MB", raw: "0 MB" };

    const match = storage.match(/^(\d+(?:\.\d+)?)\s*(\w+)$/);
    if (!match) return { value: 0, unit: "MB", raw: storage };

    const [, value, unit] = match;
    return {
      value: parseFloat(value),
      unit: unit.toUpperCase(),
      raw: storage,
    };
  };

  const getStorageColor = (storage: string | null) => {
    const { value, unit } = parseStorageValue(storage);

    // Convert to MB for comparison
    let mbValue = value;
    if (unit === "GB") mbValue = value * 1024;
    if (unit === "KB") mbValue = value / 1024;

    if (mbValue > 10000) return "text-red-500"; // > 10GB
    if (mbValue > 5000) return "text-yellow-500"; // > 5GB
    if (mbValue > 1000) return "text-blue-500"; // > 1GB
    return "text-green-500"; // < 1GB
  };

  const getHealthStatus = () => {
    if (!healthData || !qosInstance) {
      return {
        status: "inactive",
        icon: IconX,
        label: "Không hoạt động",
        color: "text-gray-500",
        bgColor: "bg-gray-50 dark:bg-gray-950",
      };
    }

    return {
      status: "active",
      icon: IconCheck,
      label: "Hoạt động",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    };
  };

  const healthStatus = getHealthStatus();
  const StorageIcon = HardDrive;
  const StatusIcon = healthStatus.icon;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconActivity className="size-5" />
            QOS Health Status
          </CardTitle>
          <CardDescription>
            Thông tin health check thời gian thực
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconAlertTriangle className="size-5 text-red-500" />
            Lỗi Health Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Không thể kết nối đến QOS instance để lấy thông tin health check.
          </p>
          <button
            onClick={() => refetch()}
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            <IconRefresh className="size-3" />
            Thử lại
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!qosInstance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconServer className="size-5" />
            QOS Instance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <IconServer className="size-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Subscription này chưa có QOS instance
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className={healthStatus.bgColor}>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={`size-4 ${healthStatus.color}`} />
              <span className="text-sm font-medium">{healthStatus.label}</span>
            </div>
            {healthData && (
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{healthData.amountUser || 0} users</span>
                <span>{healthData.amountOrder || 0} orders</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconActivity className="size-5" />
          QOS Health Status
          <Badge
            variant={healthStatus.status === "active" ? "default" : "secondary"}
          >
            {healthStatus.label}
          </Badge>
        </CardTitle>
        <CardDescription>
          Thông tin health check thời gian thực • Cập nhật:{" "}
          {format(new Date(), "HH:mm:ss", { locale: vi })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!healthData ? (
          <div className="text-center py-4">
            <IconServer className="size-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              QOS instance chưa hoạt động hoặc không thể kết nối
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Backend URL: {qosInstance.backEndUrl || "Chưa cấu hình"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Users */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                <IconUsers className="size-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Người dùng</p>
                <p className="text-lg font-bold">
                  {healthData.amountUser || 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tổng số tài khoản
                </p>
              </div>
            </div>

            {/* Tables */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                <IconTable className="size-4 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Bàn ăn</p>
                <p className="text-lg font-bold">
                  {healthData.amountTable || 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  Số bàn được cấu hình
                </p>
              </div>
            </div>

            {/* Orders */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                <IconUserCheck className="size-4 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Đơn hàng</p>
                <p className="text-lg font-bold">
                  {healthData.amountOrder || 0}
                </p>
                <p className="text-xs text-muted-foreground">Tổng số order</p>
              </div>
            </div>

            {/* Storage */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                <StorageIcon className="size-4 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Dung lượng</p>
                <p
                  className={`text-lg font-bold ${getStorageColor(healthData.usedStorage)}`}
                >
                  {parseStorageValue(healthData.usedStorage).raw}
                </p>
                <p className="text-xs text-muted-foreground">Đã sử dụng</p>
              </div>
            </div>
          </div>
        )}

        {/* QOS Instance Info */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>QOS Instance ID: {qosInstance.id}</span>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1 hover:text-blue-500"
            >
              <IconRefresh className="size-3" />
              Làm mới
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default QosHealthCard;
