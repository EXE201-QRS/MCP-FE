"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StarRating } from "@/components/review";
import { useGetPublicReviews } from "@/hooks/useReview";
import { IconQuote, IconChevronRight, IconFilter } from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AllReviewsModalProps {
  trigger?: React.ReactNode;
}

export function AllReviewsModal({ trigger }: AllReviewsModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<"all" | "service" | "platform">("all");

  const { data: reviewsData, isLoading } = useGetPublicReviews({
    page: currentPage,
    limit: 12,
    isPublic: true,
  });

  const reviews = reviewsData?.payload?.data || [];
  const totalPages = reviewsData?.payload?.totalPages || 1;

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    const ratingMatch = filterRating ? review.rating === filterRating : true;
    const typeMatch = filterType === "all" || review.reviewFor === filterType.toUpperCase();
    return ratingMatch && typeMatch;
  });

  const defaultTrigger = (
    <Button variant="outline" className="group">
      Xem tất cả đánh giá
      <IconChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconQuote className="h-5 w-5" />
            Tất cả đánh giá khách hàng
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <IconFilter className="h-4 w-4" />
            <span className="text-sm font-medium">Lọc theo:</span>
          </div>
          
          {/* Rating Filter */}
          <div className="flex gap-1">
            <Button
              variant={filterRating === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRating(null)}
            >
              Tất cả
            </Button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={filterRating === rating ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRating(rating)}
                className="flex items-center gap-1"
              >
                {rating} ⭐
              </Button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex gap-1">
            {[
              { key: "all", label: "Tất cả" },
              { key: "service", label: "Dịch vụ" },
              { key: "platform", label: "Nền tảng" },
            ].map((type) => (
              <Button
                key={type.key}
                variant={filterType === type.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type.key as typeof filterType)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-64 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <StarRating rating={review.rating} size="sm" />
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        review.reviewFor === "SERVICE"
                          ? "bg-blue-500/10 text-blue-700 border-blue-200"
                          : "bg-purple-500/10 text-purple-700 border-purple-200"
                      )}
                    >
                      {review.reviewFor === "SERVICE" ? "Dịch vụ" : "Nền tảng"}
                    </Badge>
                  </div>

                  <blockquote className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    &ldquo;{review.content}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {review.user?.name
                        ? review.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : "QOS"}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {review.user?.name || "Khách hàng"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {review.subscription?.restaurantName} •{" "}
                        {format(new Date(review.createdAt), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </div>
                    </div>
                  </div>

                  {review.adminResponse && (
                    <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                      <div className="font-medium text-primary mb-1">
                        Phản hồi từ QOS:
                      </div>
                      <div className="text-muted-foreground line-clamp-2">
                        {review.adminResponse}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        )}

        {/* Summary */}
        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          Hiển thị {filteredReviews.length} đánh giá trên trang {currentPage}/{totalPages}
        </div>
      </DialogContent>
    </Dialog>
  );
}