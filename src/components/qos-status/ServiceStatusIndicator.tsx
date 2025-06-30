"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  IconExternalLink,
  IconLoader,
  IconRefresh,
  IconServer,
  IconX,
} from "@tabler/icons-react";
import { Wrench } from "lucide-react";
import { useEffect, useState } from "react";

interface ServiceStatusIndicatorProps {
  subscriptionId: number;
  service: "frontend" | "backend";
  showUrl?: boolean;
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

export function ServiceStatusIndicator({
  subscriptionId,
  service,
  showUrl = false,
  compact = false,
  className = "",
}: ServiceStatusIndicatorProps) {
  const { data, isLoading, error, refetch } = useGetSubscriptionQosHealth({
    id: subscriptionId,
    enabled: !!subscriptionId,
  });

  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const qosInstance = data?.payload?.data?.qosInstance;
  const healthCheck = data?.payload?.data?.healthCheck;

  // Determine service status based on health check
  const getServiceStatus = (): keyof typeof statusConfig => {
    if (!qosInstance) return QosInstanceStatus.INACTIVE;
    
    // If health check is available, service is active
    if (healthCheck) {
      return QosInstanceStatus.ACTIVE;
    }
    
    // Fallback to stored status in qosInstance
    if (service === "frontend") {
      return (qosInstance.statusFE as keyof typeof statusConfig) || QosInstanceStatus.INACTIVE;
    } else {
      return (qosInstance.statusBE as keyof typeof statusConfig) || QosInstanceStatus.INACTIVE;
    }
  };

  const serviceStatus = getServiceStatus();
  const config = statusConfig[serviceStatus];
  const IconComponent = config.icon;

  const serviceUrl = service === "frontend" 
    ? qosInstance?.frontEndUrl 
    : qosInstance?.backEndUrl;

  const handleRefresh = async () => {
    await refetch();
    setLastRefresh(new Date());
  };

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading && !data) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <IconLoader className="size-4 animate-spin text-muted-foreground" />
        {!compact && <span className="text-sm text-muted-foreground">Đang tải...</span>}
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
                  Lỗi kết nối
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Không thể kiểm tra trạng thái dịch vụ</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="mt-1 h-6 px-2"
            >
              <IconRefresh className="size-3 mr-1" />
              Thử lại
            </Button>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!qosInstance) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <IconX className="size-4 text-gray-500" />
        {!compact && (
          <Badge variant="secondary" className="gap-1">
            Chưa cấu hình
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
            <div className={`flex items-center gap-1 ${className}`}>
              <IconComponent className={`size-4 ${config.color}`} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-medium">
                {service === "frontend" ? "Frontend" : "Backend"}
              </p>
              <StatusBadge />
              {serviceUrl && (
                <p className="text-xs text-muted-foreground">{serviceUrl}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Cập nhật: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <IconServer className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          {service === "frontend" ? "Frontend" : "Backend"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="h-6 w-6 p-0"
          disabled={isLoading}
        >
          <IconRefresh className={`size-3 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      
      <StatusBadge />
      
      {showUrl && serviceUrl && (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs"
          asChild
        >
          <a
            href={serviceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            <span className="truncate max-w-[200px]">{serviceUrl}</span>
            <IconExternalLink className="size-3 flex-shrink-0" />
          </a>
        </Button>
      )}
      
      <p className="text-xs text-muted-foreground">
        Cập nhật: {lastRefresh.toLocaleTimeString()}
      </p>
    </div>
  );
}

export default ServiceStatusIndicator;
