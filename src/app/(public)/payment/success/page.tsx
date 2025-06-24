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
import {
  IconBuildingStore,
  IconCheck,
  IconCreditCard,
  IconDownload,
  IconHome,
  IconMail,
  IconPackages,
  IconStar,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const planName = searchParams.get("planName");
  const restaurantName = searchParams.get("restaurantName");

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    // Send success event to analytics
    // gtag('event', 'purchase', { ... });
  }, []);

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <IconCheck className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Thanh toán thành công!
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Chúc mừng bạn đã đăng ký thành công dịch vụ QR Ordering
                </p>
              </div>
            </div>

            {/* Theme Toggle */}
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Success Card */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader className="text-center pb-6">
                  {/* Success Animation */}
                  <div className="mx-auto mb-6 relative">
                    <div className="size-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <IconCheck className="size-12 text-green-600 dark:text-green-400" />
                    </div>
                    {showConfetti && (
                      <div className="absolute -top-4 -left-4 text-2xl animate-bounce">
                        🎉
                      </div>
                    )}
                    {showConfetti && (
                      <div className="absolute -top-2 -right-4 text-2xl animate-bounce delay-100">
                        ✨
                      </div>
                    )}
                  </div>

                  <CardTitle className="text-3xl text-green-600 dark:text-green-400 mb-2">
                    Thanh toán thành công!
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Dịch vụ QR Ordering của bạn đã được kích hoạt
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-green-50 dark:bg-green-950/50 rounded-lg p-6">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                      <IconPackages className="size-5" />
                      Chi tiết đơn hàng
                    </h3>

                    <div className="space-y-3">
                      {orderId && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700 dark:text-green-300">
                            Mã đơn hàng:
                          </span>
                          <Badge variant="outline" className="font-mono">
                            #{orderId}
                          </Badge>
                        </div>
                      )}

                      {planName && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700 dark:text-green-300">
                            Gói dịch vụ:
                          </span>
                          <span className="font-medium text-green-800 dark:text-green-200">
                            {planName}
                          </span>
                        </div>
                      )}

                      {restaurantName && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700 dark:text-green-300">
                            Nhà hàng:
                          </span>
                          <span className="font-medium text-green-800 dark:text-green-200">
                            {restaurantName}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700 dark:text-green-300">
                          Ngày thanh toán:
                        </span>
                        <span className="font-medium text-green-800 dark:text-green-200">
                          {getCurrentDate()}
                        </span>
                      </div>

                      {amount && (
                        <div className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-800">
                          <span className="font-semibold text-green-800 dark:text-green-200">
                            Tổng thanh toán:
                          </span>
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(amount)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Confirmation */}
                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <IconMail className="size-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Email xác nhận đã được gửi
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Chúng tôi đã gửi email xác nhận và hướng dẫn sử dụng
                        dịch vụ đến địa chỉ email của bạn.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="flex-1">
                      <Link href="/customer/dashboard">
                        <IconHome className="size-4 mr-2" />
                        Chuyển đến Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <IconDownload className="size-4 mr-2" />
                      Tải hóa đơn
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconStar className="size-5 text-amber-500" />
                    Bước tiếp theo
                  </CardTitle>
                  <CardDescription>
                    Những việc bạn có thể làm ngay bây giờ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="size-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-primary">
                          1
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">
                          Thiết lập menu QR Code
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Truy cập dashboard để tạo menu và QR code cho nhà hàng
                          của bạn
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="size-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-primary">
                          2
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">
                          Tùy chỉnh giao diện
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Personalize menu với logo, màu sắc và phong cách của
                          nhà hàng
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="size-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold text-primary">
                          3
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">
                          In QR code và triển khai
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Tải xuống và in QR code để đặt tại các bàn trong nhà
                          hàng
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Support Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cần hỗ trợ?</CardTitle>
                  <CardDescription>
                    Đội ngũ hỗ trợ 24/7 sẵn sàng giúp bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Hotline hỗ trợ</div>
                    <div className="text-primary font-mono">1900 1234</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Email hỗ trợ</div>
                    <div className="text-primary">support@qrordering.com</div>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/support">Trung tâm hỗ trợ</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Liên kết nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/customer/subscription">
                      <IconBuildingStore className="size-4 mr-2" />
                      Quản lý nhà hàng
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/customer/payments">
                      <IconCreditCard className="size-4 mr-2" />
                      Lịch sử thanh toán
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/plans">
                      <IconPackages className="size-4 mr-2" />
                      Nâng cấp gói dịch vụ
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Testimonial */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <IconStar
                          key={i}
                          className="size-4 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>
                    <blockquote className="text-sm italic mb-3">
                      "QR Ordering đã giúp nhà hàng tôi tăng hiệu quả phục vụ
                      lên 40%. Khách hàng rất thích!"
                    </blockquote>
                    <div className="text-xs text-muted-foreground">
                      - Nguyễn Văn A, Nhà hàng Sài Gòn
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
