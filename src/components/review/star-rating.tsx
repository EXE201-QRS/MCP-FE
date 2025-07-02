import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "size-3",
  md: "size-4", 
  lg: "size-5",
};

export function StarRating({
  rating,
  interactive = false,
  onChange,
  size = "md",
  showText = false,
  className,
}: StarRatingProps) {
  const starClass = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star}>
            {interactive ? (
              <button
                type="button"
                onClick={() => onChange && onChange(star)}
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
              >
                {star <= rating ? (
                  <IconStarFilled className={cn(starClass, "text-yellow-400 hover:text-yellow-500 transition-colors")} />
                ) : (
                  <IconStar className={cn(starClass, "text-gray-300 hover:text-yellow-400 transition-colors")} />
                )}
              </button>
            ) : star <= rating ? (
              <IconStarFilled className={cn(starClass, "text-yellow-400")} />
            ) : (
              <IconStar className={cn(starClass, "text-gray-300")} />
            )}
          </div>
        ))}
      </div>
      {showText && (
        <span className="text-sm text-muted-foreground ml-1">
          ({rating}/5)
        </span>
      )}
    </div>
  );
}
