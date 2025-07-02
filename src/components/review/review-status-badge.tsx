import { Badge } from "@/components/ui/badge";
import { ReviewStatus } from "@/constants/review.constant";
import { cn } from "@/lib/utils";
import { IconCheck, IconClock, IconX } from "@tabler/icons-react";

interface ReviewStatusBadgeProps {
  status: string;
  className?: string;
}

export function ReviewStatusBadge({ status, className }: ReviewStatusBadgeProps) {
  const statusConfig = {
    [ReviewStatus.PENDING]: {
      label: "Chờ duyệt",
      variant: "secondary" as const,
      className:
        "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400",
      icon: IconClock,
    },
    [ReviewStatus.APPROVED]: {
      label: "Đã duyệt",
      variant: "default" as const,
      className:
        "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400",
      icon: IconCheck,
    },
    [ReviewStatus.REJECTED]: {
      label: "Từ chối",
      variant: "destructive" as const,
      className: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400",
      icon: IconX,
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    variant: "secondary" as const,
    className: "",
    icon: IconClock,
  };

  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={cn("gap-1", config.className, className)}>
      <Icon className="size-3" />
      {config.label}
    </Badge>
  );
}
