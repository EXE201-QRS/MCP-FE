"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QosInstanceStatus } from "@/constants/qos-instance.constant";
import { useGetSubscriptionQosHealth } from "@/hooks/useSubscription";
import {
  IconAlertTriangle,
  IconCheck,
  IconLoader,
  IconServer,
  IconX,
} from "@tabler/icons-react";
import { Wrench } from "lucide-react";

interface OverallServiceStatusProps {
  subscriptionId: number;
  compact?: boolean;
  className?: string;
}

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

export function OverallServiceStatus({
  subscriptionId,
  compact = false,
  className = "",
}: OverallServiceStatusProps) {
  const { data, isLoading, error } = useGetSubscriptionQosHealth({
    id: subscriptionId,
    enabled: !!subscriptionId,
  });

  const qosInstance = data?.payload?.data?.qosInstance;
  const healthCheck = data?.payload?.data?.healthCheck;

  const getOverallStatus = (): keyof typeof statusConfig => {
    if (!qosInstance) return QosInstanceStatus.INACTIVE;

    // If health check is available, services are responsive
    if (healthCheck) {
      // Both FE and BE are responding if health check works
      return QosInstanceStatus.ACTIVE;
    }

    // Fallback to stored statuses (prioritize errors)
    const statuses = [qosInstance.statusFE, qosInstance.statusBE];

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

  const overallStatus = getOverallStatus();
  const config = statusConfig[overallStatus];
  const IconComponent = config.icon;

  if (isLoading && !data) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <IconLoader className="size-4 animate-spin text-muted-foreground" />
        {!compact && (
          <Badge variant="outline" className="gap-1">
            Đang kiểm tra...
          </Badge>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-2 ${className}`}>
              <IconAlertTriangle className="size-4 text-red-500" />
              {!compact && (
                <Badge variant="destructive" className="gap-1">
                  Lỗi kiểm tra
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Không thể kiểm tra trạng thái tổng quan</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!qosInstance) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <IconServer className="size-4 text-gray-500" />
        {!compact && (
          <Badge variant="secondary" className="gap-1">
            Chưa có instance
          </Badge>
        )}
      </div>
    );
  }

  const StatusBadge = () => (
    <Badge variant={config.variant} className="gap-1">
      <IconComponent className={`size-3 ${config.color}`} />
      {config.label}
    </Badge>
  );

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-2 p-2 rounded-md ${config.bgColor} ${className}`}>
              <IconComponent className={`size-4 ${config.color}`} />
              <span className="text-sm font-medium">{config.label}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-medium">Trạng thái tổng quan</p>
              <StatusBadge />
              {healthCheck ? (
                <p className="text-xs text-green-600">
                  ✓ Health check thành công
                </p>
              ) : (
                <p className="text-xs text-yellow-600">
                  ⚠ Không có health check
                </p>
              )}
              <div className="text-xs text-muted-foreground">
                <p>FE: {qosInstance?.statusFE || 'N/A'}</p>
                <p>BE: {qosInstance?.statusBE || 'N/A'}</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card className={`${config.bgColor} ${className}`}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconComponent className={`size-6 ${config.color}`} />
            <div>
              <h4 className="font-semibold">Trạng thái tổng quan</h4>
              <StatusBadge />
            </div>
          </div>
          <div className="text-right">
            {healthCheck ? (
              <div className="text-xs text-green-600 font-medium">
                ✓ Health check OK
              </div>
            ) : (
              <div className="text-xs text-yellow-600">
                ⚠ Chưa có health check
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-1">
              FE: {qosInstance?.statusFE || 'N/A'} | BE: {qosInstance?.statusBE || 'N/A'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OverallServiceStatus;
