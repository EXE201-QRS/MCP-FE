"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/review";
import { useGetPublicReviews } from "@/hooks/useReview";
import { IconQuote } from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";



export function TestimonialsSection() {
  // Fetch public reviews with higher rating first
  const { data: reviewsData, isLoading } = useGetPublicReviews({
    page: 1,
    limit: 6, // Show 6 reviews
    isPublic: true,
  });

  const publicReviews = reviewsData?.payload?.data || [];

  // Sort by rating and created date to show best reviews first
  const sortedReviews = [...publicReviews]
    .filter((review) => review.rating >= 4) // Only show 4-5 star reviews
    .sort((a, b) => {
      if (a.rating !== b.rating) {
        return b.rating - a.rating; // Higher rating first
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newer first
    })
    .slice(0, 6); // Limit to 6 reviews

  // Calculate average rating from all public reviews
  const averageRating =
    publicReviews.length > 0
      ? publicReviews.reduce((sum, review) => sum + review.rating, 0) /
        publicReviews.length
      : 0;

  // Show loading skeleton or fallback content
  if (isLoading || sortedReviews.length === 0) {
    return (
      <section id="testimonials" className="bg-muted/20 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline" className="mb-8">
              Đánh giá khách hàng
            </Badge>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Được tin dùng bởi hàng trăm nhà hàng
            </h2>
            <p className="mx-auto mb-16 max-w-2xl text-lg text-muted-foreground">
              Khách hàng của chúng tôi đã tăng trưởng doanh thu và cải thiện trải
              nghiệm khách hàng đáng kể khi sử dụng QOS.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="size-4 bg-muted rounded"
                        />
                      ))}
                    </div>
                    <div className="size-8 bg-muted rounded" />
                  </div>

                  <div className="mb-6 space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-muted rounded-full" />
                    <div className="space-y-1 flex-1">
                      <div className="h-4 bg-muted rounded w-24" />
                      <div className="h-3 bg-muted rounded w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="bg-muted/20 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-8">
            Đánh giá khách hàng
          </Badge>
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Được tin dùng bởi hàng trăm nhà hàng
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-lg text-muted-foreground">
            Khách hàng của chúng tôi đã tăng trưởng doanh thu và cải thiện trải
            nghiệm khách hàng đáng kể khi sử dụng QOS.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedReviews.map((review) => (
            <Card
              key={review.id}
              className="group hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                <StarRating rating={review.rating} size="sm" />
                  <IconQuote className="size-8 text-muted-foreground/30" />
                </div>

                <blockquote className="mb-6 text-sm leading-relaxed text-muted-foreground line-clamp-4">
                  &ldquo;{review.content}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {review.user?.name
                      ? review.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "QOS"}
                  </div>
                  <div>
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

                {/* Show review type */}
                <div className="mt-3">
                  <Badge
                    variant="outline"
                    className={
                      review.reviewFor === "SERVICE"
                        ? "bg-blue-500/10 text-blue-700 border-blue-200 text-xs"
                        : "bg-purple-500/10 text-purple-700 border-purple-200 text-xs"
                    }
                  >
                    {review.reviewFor === "SERVICE" ? "Dịch vụ" : "Nền tảng"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg bg-background/50 px-4 py-2 backdrop-blur">
            <div className="flex items-center gap-1">
              <StarRating rating={5} size="md" showText={false} />
            </div>
            <div className="text-sm">
              <span className="font-semibold">
                {averageRating > 0 ? averageRating.toFixed(1) : "5.0"}/5
              </span>{" "}
              từ {publicReviews.length}+ đánh giá
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
