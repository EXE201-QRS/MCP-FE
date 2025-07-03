"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/review";
import { useGetPublicReviews } from "@/hooks/useReview";
import { IconQuote, IconStar } from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AllReviewsModal } from "./all-reviews-modal";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function TestimonialsSection() {
  const [activeFilter, setActiveFilter] = useState<"all" | "service" | "platform">("all");
  
  // Fetch more reviews to have a better selection
  const { data: reviewsData, isLoading } = useGetPublicReviews({
    page: 1,
    limit: 20, // Get more reviews
    isPublic: true,
  });

  const publicReviews = reviewsData?.payload?.data || [];

  // Filter reviews based on active filter
  const filteredReviews = publicReviews.filter((review) => {
    if (activeFilter === "all") return review.rating >= 4; // Only show 4-5 star reviews
    return review.reviewFor === activeFilter.toUpperCase() && review.rating >= 4;
  });

  // Sort by rating and created date to show best reviews first
  const sortedReviews = [...filteredReviews]
    .sort((a, b) => {
      if (a.rating !== b.rating) {
        return b.rating - a.rating; // Higher rating first
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newer first
    })
    .slice(0, 9); // Show up to 9 reviews in a 3x3 grid

  // Calculate statistics
  const averageRating =
    publicReviews.length > 0
      ? publicReviews.reduce((sum, review) => sum + review.rating, 0) /
        publicReviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: publicReviews.filter((review) => review.rating === rating).length,
    percentage: publicReviews.length > 0 
      ? (publicReviews.filter((review) => review.rating === rating).length / publicReviews.length) * 100
      : 0,
  }));

  const serviceReviews = publicReviews.filter(r => r.reviewFor === "SERVICE").length;
  const platformReviews = publicReviews.filter(r => r.reviewFor === "PLATFORM").length;

  // Loading skeleton
  if (isLoading) {
    return (
      <section id="testimonials" className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="h-6 w-32 bg-muted rounded mx-auto mb-8" />
            <div className="h-10 w-96 bg-muted rounded mx-auto mb-6" />
            <div className="h-6 w-2/3 bg-muted rounded mx-auto mb-16" />
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-64 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background py-20 sm:py-32">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto max-w-6xl text-center">
          <Badge variant="outline" className="mb-8 bg-background/50 backdrop-blur">
            <IconStar className="mr-2 h-3 w-3" />
            Đánh giá khách hàng
          </Badge>
          
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Được tin dùng bởi{" "}
            <span className="text-primary">hàng trăm nhà hàng</span>
          </h2>
          
          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
            Khách hàng của chúng tôi đã tăng trưởng doanh thu và cải thiện trải
            nghiệm khách hàng đáng kể khi sử dụng QOS.
          </p>

          {/* Statistics Cards */}
          <div className="mb-16 grid gap-6 sm:grid-cols-3">
            <Card className="bg-background/50 backdrop-blur border-2">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <StarRating rating={5} size="lg" showText={false} />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {averageRating > 0 ? averageRating.toFixed(1) : "5.0"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Đánh giá trung bình từ {publicReviews.length}+ khách hàng
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur border-2">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {serviceReviews}
                </div>
                <div className="text-sm text-muted-foreground">
                  Đánh giá về dịch vụ
                </div>
                <Badge variant="outline" className="mt-2 bg-blue-500/10 text-blue-700 border-blue-200">
                  Dịch vụ
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur border-2">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {platformReviews}
                </div>
                <div className="text-sm text-muted-foreground">
                  Đánh giá về nền tảng
                </div>
                <Badge variant="outline" className="mt-2 bg-purple-500/10 text-purple-700 border-purple-200">
                  Nền tảng
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-12 flex justify-center">
          <div className="flex space-x-1 rounded-lg bg-muted p-1">
            {[
              { key: "all", label: "Tất cả", count: filteredReviews.length },
              { key: "service", label: "Dịch vụ", count: serviceReviews },
              { key: "platform", label: "Nền tảng", count: platformReviews },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
                className={cn(
                  "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  activeFilter === filter.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <span>{filter.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {filter.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {sortedReviews.map((review, index) => (
            <Card
              key={review.id}
              className={cn(
                "group relative bg-background/50 backdrop-blur transition-all duration-500 hover:shadow-xl hover:scale-105 border-2",
                // Highlight special reviews
                review.rating === 5 && index < 3 && "ring-2 ring-primary/20"
              )}
            >
              <CardContent className="p-6">
                {/* Rating and Quote Icon */}
                <div className="mb-4 flex items-center justify-between">
                  <StarRating rating={review.rating} size="sm" />
                  <IconQuote className="size-8 text-muted-foreground/20 group-hover:text-primary/30 transition-colors" />
                </div>

                {/* Review Content */}
                <blockquote className="mb-6 text-sm leading-relaxed text-muted-foreground line-clamp-4 group-hover:text-foreground transition-colors">
                  &ldquo;{review.content}&rdquo;
                </blockquote>

                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xs font-medium text-primary-foreground">
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
                    <div className="font-medium text-foreground">
                      {review.user?.name || "Khách hàng"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {review.subscription?.restaurantName} •{" "}
                      {format(new Date(review.createdAt), "MMM yyyy", {
                        locale: vi,
                      })}
                    </div>
                  </div>
                </div>

                {/* Review Type Badge */}
                <div className="flex justify-between items-center">
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
                  
                  {review.rating === 5 && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-200 text-xs">
                      ⭐ Xuất sắc
                    </Badge>
                  )}
                </div>

                {/* Admin Response if exists */}
                {review.adminResponse && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg border-l-2 border-primary">
                    <div className="text-xs font-medium text-primary mb-1">
                      Phản hồi từ QOS Team:
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {review.adminResponse}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rating Distribution */}
        <div className="mx-auto max-w-2xl">
          <h3 className="text-xl font-semibold text-center mb-6">Phân bố đánh giá</h3>
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <IconStar className="h-3 w-3 fill-current text-amber-500" />
                </div>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground w-12 text-right">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-lg bg-background/50 px-6 py-3 backdrop-blur border-2">
            <div className="flex items-center gap-1">
              <StarRating rating={5} size="md" showText={false} />
            </div>
            <div className="text-sm">
              <span className="font-semibold">
                {averageRating > 0 ? averageRating.toFixed(1) : "5.0"}/5
              </span>{" "}
              từ {publicReviews.length}+ đánh giá thực tế
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tham gia cùng hàng trăm nhà hàng đã tin tưởng QOS để phát triển kinh doanh
            </p>
            
            <AllReviewsModal />
          </div>
        </div>
      </div>
    </section>
  );
}