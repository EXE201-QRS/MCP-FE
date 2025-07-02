import { Badge } from "@/components/ui/badge";
import { ReviewFor } from "@/constants/review.constant";
import { cn } from "@/lib/utils";

interface ReviewTypeBadgeProps {
  reviewFor: string;
  className?: string;
}

export function ReviewTypeBadge({ reviewFor, className }: ReviewTypeBadgeProps) {
  const config = {
    [ReviewFor.SERVICE]: {
      label: "Dịch vụ",
      className:
        "bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400",
    },
    [ReviewFor.PLATFORM]: {
      label: "Nền tảng",
      className:
        "bg-purple-500/10 text-purple-700 border-purple-200 dark:text-purple-400",
    },
  };

  const item = config[reviewFor as keyof typeof config] || {
    label: reviewFor,
    className: "",
  };

  return (
    <Badge variant="outline" className={cn(item.className, className)}>
      {item.label}
    </Badge>
  );
}
