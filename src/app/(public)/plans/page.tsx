"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useGetServicePlanList } from "@/hooks/useServicePlan";
import { useGetSubscriptionList } from "@/hooks/useSubscription";
import { useAuthStore } from "@/stores/auth.store";
import {
  IconCheck,
  IconCreditCard,
  IconCrown,
  IconPackages,
  IconStar,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
import Link from "next/link";

export default function PlansPage() {
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading, error } = useGetServicePlanList({
    page: 1,
    limit: 10,
  });

  // Get user's subscriptions to check for pending ones
  const { data: subscriptionsData } = useGetSubscriptionList({
    page: 1,
    limit: 100,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getRecommendedPlan = () => {
    if (!data?.payload?.data || data.payload.data.length === 0) return null;
    // Recommend middle plan if 3 plans, or second plan if more
    const middleIndex = Math.floor(data.payload.data.length / 2);
    return data.payload.data[middleIndex]?.id;
  };

  const getPlanFeatures = (planName: string) => {
    const lowerName = planName.toLowerCase();

    if (lowerName.includes("basic")) {
      return [
        "QR Code menu cơ bản",
        "Tối đa 20 món ăn",
        "1 nhà hàng",
        "Báo cáo cơ bản",
        "Hỗ trợ email",
      ];
    } else if (lowerName.includes("professional")) {
      return [
        "QR Code menu nâng cao",
        "Không giới hạn món ăn",
        "1 nhà hàng",
        "Báo cáo chi tiết",
        "Quản lý đơn hàng",
        "Hỗ trợ 24/7",
      ];
    } else if (lowerName.includes("enterprise")) {
      return [
        "QR Code menu toàn diện",
        "Không giới hạn món ăn",
        "Nhiều chi nhánh",
        "Analytics nâng cao",
        "API tích hợp",
        "Quản lý nhân viên",
        "Hỗ trợ ưu tiên",
      ];
    } else {
      return [
        "QR Code menu",
        "Quản lý món ăn",
        "Báo cáo doanh thu",
        "Hỗ trợ khách hàng",
      ];
    }
  };

  // Check if user has pending subscription for a specific plan
  const hasPendingSubscription = (planId: number) => {
    return subscriptionsData?.payload?.data?.some(
      (sub) => sub.servicePlanId === planId && sub.status === "PENDING"
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-destructive mb-4">
                Có lỗi xảy ra khi tải dữ liệu gói dịch vụ.
              </div>
              <Button asChild>
                <Link href="/">Quay về trang chủ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
  {/* Header */}
  <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
  <div className="container mx-auto px-4 py-6">
  <div className="flex items-center justify-between">
  <div className="flex items-center gap-4">
  <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
  <IconPackages className="size-6 text-primary" />
  </div>
  <div>
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
  Gói dịch vụ QR Ordering
  </h1>
  <p className="text-gray-600 dark:text-gray-300">
  Chọn gói phù hợp để bắt đầu số hóa nhà hàng
  </p>
  </div>
  </div>
  
  {/* Auth Actions & Theme Toggle */}
  <div className="flex items-center gap-3">
  <ModeToggle />
  {!isAuthenticated && (
  <>
  <Button variant="outline" asChild>
  <Link href="/login">
      <IconUser className="size-4 mr-2" />
        Đăng nhập
      </Link>
  </Button>
  <Button asChild>
  <Link href="/register">
      <IconUserPlus className="size-4 mr-2" />
        Đăng ký
        </Link>
        </Button>
        </>
        )}
        </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Auth Required Message */}
        {!isAuthenticated && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <IconUser className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                  Đăng nhập để xem và đăng ký gói dịch vụ
                </h3>
                <p className="text-blue-700 dark:text-blue-300 mb-3">
                  Bạn cần có tài khoản để có thể đăng ký sử dụng dịch vụ QR
                  Ordering
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">
                      <IconUser className="size-4 mr-2" />
                      Đăng nhập
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">
                      <IconUserPlus className="size-4 mr-2" />
                      Tạo tài khoản mới
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Subscriptions Alert */}
        {isAuthenticated &&
          subscriptionsData?.payload?.data?.some(
            (sub) => sub.status === "PENDING"
          ) && (
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
                  <IconPackages className="size-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    Bạn có{" "}
                    {
                      subscriptionsData?.payload?.data?.filter(
                        (sub) => sub.status === "PENDING"
                      ).length
                    }{" "}
                    đăng ký chờ thanh toán
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 mb-3">
                    Hoàn tất thanh toán để kích hoạt các gói dịch vụ đã đăng ký
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/customer/dashboard">
                      <IconCreditCard className="size-4 mr-2" />
                      Xem và thanh toán
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="relative">
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded-md" />
                  <div className="h-4 bg-muted animate-pulse rounded-md w-2/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-8 bg-muted animate-pulse rounded-md" />
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-4 bg-muted animate-pulse rounded-md"
                    />
                  ))}
                  <div className="h-10 bg-muted animate-pulse rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data?.payload?.data.length === 0 ? (
          <div className="text-center py-12">
            <IconPackages className="size-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Hiện tại chưa có gói dịch vụ nào
            </h3>
            <p className="text-muted-foreground mb-6">
              Vui lòng liên hệ với chúng tôi để được hỗ trợ.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">Liên hệ hỗ trợ</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Quay về trang chủ</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {data?.payload?.data.map((plan) => {
                const isRecommended = plan.id === getRecommendedPlan();
                const features = getPlanFeatures(plan.name);

                return (
                  <Card
                    key={plan.id}
                    className={`relative transition-all duration-300 hover:scale-105 hover:shadow-lg dark:hover:shadow-xl ${
                      isRecommended
                        ? "ring-2 ring-primary shadow-lg scale-105"
                        : "hover:ring-1 hover:ring-gray-200 dark:hover:ring-gray-600"
                    }`}
                  >
                    {/* Recommended Badge */}
                    {isRecommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground px-3 py-1">
                          <IconCrown className="size-3 mr-1" />
                          Phổ biến nhất
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl font-bold">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="min-h-[48px]">
                        {plan.description || "Gói dịch vụ chất lượng cao"}
                      </CardDescription>
                      <div className="pt-4">
                        <div className="text-3xl font-bold text-primary">
                          {formatCurrency(plan.price)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          /tháng
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Features List */}
                      <div className="space-y-3">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded-full">
                              <IconCheck className="size-3 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      {isAuthenticated ? (
                        hasPendingSubscription(plan.id) ? (
                          <div className="space-y-2 mt-6">
                            <Badge
                              variant="secondary"
                              className="w-full justify-center py-2"
                            >
                              Đã đăng ký - Chờ thanh toán
                            </Badge>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Link href="/customer/dashboard">
                                Xem chi tiết
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          <Button
                            asChild
                            className={`w-full mt-6 ${
                              isRecommended
                                ? "bg-primary hover:bg-primary/90"
                                : ""
                            }`}
                            variant={isRecommended ? "default" : "outline"}
                          >
                            <Link href={`/checkout?planId=${plan.id}`}>
                              Chọn gói này
                            </Link>
                          </Button>
                        )
                      ) : (
                        <Button
                          asChild
                          className="w-full mt-6"
                          variant="outline"
                          disabled
                        >
                          <span>Đăng nhập để chọn gói</span>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Trust Indicators */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    500+
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">Nhà hàng tin tùng</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    <div className="flex items-center justify-center gap-1">
                      4.9
                      <IconStar className="size-5 text-yellow-500 fill-current" />
                    </div>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">Đánh giá từ khách hàng</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    24/7
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">Hỗ trợ khách hàng</div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="text-center mt-8">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Cần tư vấn thêm? Chúng tôi sẵn sàng hỗ trợ bạn.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/contact">Liên hệ tư vấn</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/">Tìm hiểu thêm</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
