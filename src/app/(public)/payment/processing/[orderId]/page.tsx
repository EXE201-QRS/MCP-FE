"use client";

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
  IconArrowLeft,
  IconCheck,
  IconClock,
  IconLoader2,
  IconRefresh,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Timeout after 5 minutes
  const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes
  const CHECK_INTERVAL = 1000; // 1 second

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        const newTime = prev + CHECK_INTERVAL;
        if (newTime >= TIMEOUT_DURATION) {
          setIsTimedOut(true);
          clearInterval(interval);
        }
        return newTime;
      });
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleRefresh = () => {
    // In real implementation, this would check payment status
    window.location.reload();
  };

  const handleReturnToCheckout = () => {
    router.push("/plans");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <IconClock className="size-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Đang xử lý thanh toán
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Vui lòng chờ trong giây lát...
                </p>
              </div>
            </div>

            {/* Theme Toggle */}
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-6">
              <div className="mx-auto mb-4">
                {!isTimedOut ? (
                  <div className="relative">
                    <IconLoader2 className="size-16 text-primary animate-spin mx-auto" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-8 bg-white dark:bg-gray-900 rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  <IconClock className="size-16 text-amber-500 mx-auto" />
                )}
              </div>

              <CardTitle className="text-2xl mb-2">
                {!isTimedOut ? "Đang xử lý thanh toán" : "Quá thời gian chờ"}
              </CardTitle>

              <CardDescription className="text-base">
                {!isTimedOut ? (
                  <>
                    Hệ thống đang xác nhận giao dịch của bạn.
                    <br />
                    Quá trình này có thể mất vài phút.
                  </>
                ) : (
                  <>
                    Không nhận được phản hồi từ hệ thống thanh toán.
                    <br />
                    Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ.
                  </>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Progress Indicators */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <IconCheck className="size-4 text-green-500" />
                    Thông tin đã được gửi
                  </span>
                  <span className="text-muted-foreground">✓</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    {!isTimedOut ? (
                      <IconLoader2 className="size-4 text-primary animate-spin" />
                    ) : (
                      <IconClock className="size-4 text-amber-500" />
                    )}
                    Đang xử lý thanh toán
                  </span>
                  <span className="text-muted-foreground">
                    {!isTimedOut ? "⏳" : "⚠️"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <IconClock className="size-4" />
                    Xác nhận kết quả
                  </span>
                  <span>⏸️</span>
                </div>
              </div>

              {/* Timer */}
              <div className="p-4 bg-muted/30 dark:bg-gray-800/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Thời gian đã trôi qua
                </div>
                <div className="text-2xl font-mono font-bold text-primary">
                  {formatTime(timeElapsed)}
                </div>
                {!isTimedOut && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Tối đa 5:00 phút
                  </div>
                )}
              </div>

              {/* Order Info */}
              {orderId && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                    Mã đơn hàng
                  </div>
                  <div className="font-mono text-blue-900 dark:text-blue-100">
                    #{orderId}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {!isTimedOut ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleRefresh}
                      className="flex-1"
                    >
                      <IconRefresh className="size-4 mr-2" />
                      Làm mới
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleReturnToCheckout}
                      className="flex-1"
                    >
                      <IconArrowLeft className="size-4 mr-2" />
                      Quay lại
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleRefresh} className="flex-1">
                      <IconRefresh className="size-4 mr-2" />
                      Thử lại
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReturnToCheckout}
                      className="flex-1"
                    >
                      <IconArrowLeft className="size-4 mr-2" />
                      Quay lại chọn gói
                    </Button>
                  </>
                )}
              </div>

              {/* Help Text */}
              <div className="text-xs text-muted-foreground pt-4 border-t">
                <p className="mb-2">
                  <strong>Lưu ý:</strong> Không đóng trang này trong quá trình
                  xử lý.
                </p>
                <p>
                  Nếu có vấn đề, vui lòng liên hệ hỗ trợ:
                  <span className="text-primary"> support@qrordering.com</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
