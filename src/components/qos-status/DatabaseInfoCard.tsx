"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSubscriptionQosHealth } from "@/hooks/useSubscription";
import { IconDatabase, IconRefresh } from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface DatabaseInfoCardProps {
  subscriptionId: number;
  instance: {
    dbName: string | null;
    dbSize: number | null;
    lastBackup: string | null;
    statusDb: string;
  };
  className?: string;
}

const formatBytes = (bytes: number | null) => {
  if (!bytes) return "0 MB";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};

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

export function DatabaseInfoCard({ subscriptionId, instance, className = "" }: DatabaseInfoCardProps) {
  const { data, isLoading, error, refetch } = useGetSubscriptionQosHealth({
    id: subscriptionId,
    enabled: !!subscriptionId,
  });

  const healthCheck = data?.payload?.data?.healthCheck;
  const qosInstance = data?.payload?.data?.qosInstance;

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconDatabase className="size-5" />
            Thông tin Database
          </CardTitle>
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconDatabase className="size-5" />
          Thông tin Database
          <button
            onClick={() => refetch()}
            className="ml-auto p-1 hover:bg-muted rounded-md"
            disabled={isLoading}
          >
            <IconRefresh className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tên Database</span>
            <span className="text-sm font-mono">
              {instance.dbName || "Chưa cấu hình"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Kích thước (static)</span>
            <span className="text-sm text-muted-foreground">
              {formatBytes(instance.dbSize)}
            </span>
          </div>

          {healthCheck?.usedStorage && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Dung lượng sử dụng (real-time)</span>
              <span className="text-sm font-semibold text-blue-600">
                {parseStorageValue(healthCheck.usedStorage).raw}
              </span>
            </div>
          )}
          
          {instance.lastBackup && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Backup cuối</span>
              <span className="text-sm">
                {format(new Date(instance.lastBackup), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Trạng thái (stored)</span>
            <Badge variant="outline" className="text-xs">
              {instance.statusDb}
            </Badge>
          </div>
        </div>
        
        <div className="pt-3 border-t space-y-2">
          {healthCheck ? (
            <div className="space-y-1">
              <p className="text-xs font-medium text-green-600">
                ✓ Kết nối database thành công
              </p>
              <p className="text-xs text-muted-foreground">
                Dung lượng real-time từ health check: {healthCheck.usedStorage || "N/A"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs font-medium text-yellow-600">
                ⚠ Không thể lấy thông tin real-time
              </p>
              <p className="text-xs text-muted-foreground">
                Hiển thị thông tin static từ metadata đã lưu
              </p>
            </div>
          )}
          
          {error && (
            <p className="text-xs text-red-600">
              ❌ Lỗi kết nối: Không thể kiểm tra database
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default DatabaseInfoCard;
