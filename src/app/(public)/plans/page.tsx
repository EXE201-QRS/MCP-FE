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
import { useGetServicePlanList } from "@/hooks/useServicePlan";
import {
  IconCheck,
  IconCrown,
  IconPackages,
  IconStar,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PlansPage() {
  const searchParams = useSearchParams();
  const fromRegister = searchParams.get("from") === "register";

  const { data, isLoading, error } = useGetServicePlanList({
    page: 1,
    limit: 10,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getRecommendedPlan = () => {
    if (!data?.payload.data || data.payload.data.length === 0) return null;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconPackages className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Chọn gói dịch vụ phù hợp
              </h1>
              <p className="text-gray-600">
                Bắt đầu hành trình số hóa nhà hàng của bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Message for New Users */}
        {fromRegister && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <IconCheck className="size-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  Đăng ký thành công! 🎉
                </h3>
                <p className="text-green-700">
                  Bây giờ hãy chọn gói dịch vụ phù hợp để bắt đầu sử dụng hệ
                  thống QR Ordering.
                </p>
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
                    className={`relative transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      isRecommended
                        ? "ring-2 ring-primary shadow-lg scale-105"
                        : "hover:ring-1 hover:ring-gray-200"
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
                            <div className="p-1 bg-green-100 rounded-full">
                              <IconCheck className="size-3 text-green-600" />
                            </div>
                            <span className="text-sm text-gray-700">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Button
                        asChild
                        className={`w-full mt-6 ${
                          isRecommended ? "bg-primary hover:bg-primary/90" : ""
                        }`}
                        variant={isRecommended ? "default" : "outline"}
                      >
                        <Link href={`/checkout?planId=${plan.id}`}>
                          {isRecommended ? "Chọn gói này" : "Chọn gói"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    500+
                  </div>
                  <div className="text-gray-600">Nhà hàng tin tùng</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    <div className="flex items-center justify-center gap-1">
                      4.9
                      <IconStar className="size-5 text-yellow-500 fill-current" />
                    </div>
                  </div>
                  <div className="text-gray-600">Đánh giá từ khách hàng</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    24/7
                  </div>
                  <div className="text-gray-600">Hỗ trợ khách hàng</div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
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
