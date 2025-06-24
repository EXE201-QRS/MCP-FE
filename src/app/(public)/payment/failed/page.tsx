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
import { Separator } from "@/components/ui/separator";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCreditCard,
  IconHeadphones,
  IconMail,
  IconPhone,
  IconRefresh,
  IconShield,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const planId = searchParams.get("planId");

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  const getErrorMessage = (errorCode: string | null) => {
    const errorMessages: Record<string, string> = {
      "INSUFFICIENT_FUNDS": "Tài khoản không đủ số dư",
      "CARD_DECLINED": "Thẻ bị từ chối, vui lòng thử thẻ khác",
      "EXPIRED_CARD": "Thẻ đã hết hạn",
      "INVALID_CARD": "Thông tin thẻ không hợp lệ",
      "NETWORK_ERROR": "Lỗi kết nối mạng",
      "TIMEOUT": "Giao dịch quá thời gian chờ",
      "CANCELLED": "Giao dịch bị hủy bởi người dùng",
      "BANK_ERROR": "Lỗi từ ngân hàng",
      "SYSTEM_ERROR": "Lỗi hệ thống",
    };

    return errorMessages[errorCode || ""] || "Có lỗi xảy ra trong quá trình thanh toán";
  };

  const getErrorSolution = (errorCode: string | null) => {
    const solutions: Record<string, string[]> = {
      "INSUFFICIENT_FUNDS": [
        "Kiểm tra số dư tài khoản",
        "Nạp thêm tiền vào tài khoản",
        "Sử dụng thẻ/tài khoản khác"
      ],
      "CARD_DECLINED": [
        "Kiểm tra thông tin thẻ",
        "Liên hệ ngân hàng phát hành thẻ",
        "Sử dụng thẻ khác"
      ],
      "EXPIRED_CARD": [
        "Sử dụng thẻ còn hạn sử dụng",
        "Liên hệ ngân hàng để gia hạn thẻ"
      ],
      "NETWORK_ERROR": [
        "Kiểm tra kết nối internet",
        "Thử lại sau vài phút",
        "Sử dụng mạng khác"
      ],
      "TIMEOUT": [
        "Thử lại giao dịch",
        "Kiểm tra kết nối internet",
        "Liên hệ hỗ trợ nếu vấn đề tiếp tục"
      ]
    };

    return solutions[errorCode || ""] || [
      "Kiểm tra thông tin thanh toán",
      "Thử lại sau vài phút",
      "Liên hệ hỗ trợ khách hàng"
    ];
  };

  const retryUrl = planId ? `/checkout?planId=${planId}` : '/plans';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <IconAlertCircle className="size-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Thanh toán thất bại
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Giao dịch của bạn không thể hoàn tất
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
            {/* Main Error Card */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader className="text-center pb-6">
                  {/* Error Icon */}
                  <div className="mx-auto mb-6">
                    <div className="size-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <IconAlertCircle className="size-12 text-red-600 dark:text-red-400" />
                    </div>
                  </div>

                  <CardTitle className="text-3xl text-red-600 dark:text-red-400 mb-2">
                    Thanh toán thất bại
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {getErrorMessage(error)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Error Details */}
                  {(orderId || amount) && (
                    <div className="bg-red-50 dark:bg-red-950/50 rounded-lg p-6">
                      <h3 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                        <IconCreditCard className="size-5" />
                        Chi tiết giao dịch
                      </h3>
                      
                      <div className="space-y-3">
                        {orderId && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-red-700 dark:text-red-300">Mã giao dịch:</span>
                            <span className="font-mono text-red-800 dark:text-red-200">
                              #{orderId}
                            </span>
                          </div>
                        )}
                        
                        {amount && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-red-700 dark:text-red-300">Số tiền:</span>
                            <span className="font-semibold text-red-800 dark:text-red-200">
                              {formatCurrency(amount)}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-red-700 dark:text-red-300">Thời gian:</span>
                          <span className="text-red-800 dark:text-red-200">
                            {new Date().toLocaleString("vi-VN")}
                          </span>
                        </div>
                        
                        {error && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-red-700 dark:text-red-300">Mã lỗi:</span>
                            <span className="font-mono text-red-800 dark:text-red-200">
                              {error}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Solutions */}
                  <div className="bg-amber-50 dark:bg-amber-950/50 rounded-lg p-6">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
                      <IconShield className="size-5" />
                      Cách khắc phục
                    </h3>
                    
                    <ul className="space-y-2">
                      {getErrorSolution(error).map((solution, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300">
                          <span className="size-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="flex-1">
                      <Link href={retryUrl}>
                        <IconRefresh className="size-4 mr-2" />
                        Thử lại thanh toán
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/plans">
                        <IconArrowLeft className="size-4 mr-2" />
                        Quay lại chọn gói
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <IconShield className="size-5 text-green-600" />
                    Bảo mật thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <IconShield className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Thông tin được bảo mật</h4>
                      <p className="text-sm text-muted-foreground">
                        Tất cả thông tin thanh toán của bạn được mã hóa SSL 256-bit và không được lưu trữ trên hệ thống của chúng tôi.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <IconCreditCard className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Không bị trừ tiền</h4>
                      <p className="text-sm text-muted-foreground">
                        Giao dịch thất bại không được xử lý, tài khoản của bạn sẽ không bị trừ tiền.
                      </p>
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
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IconHeadphones className="size-5" />
                    Cần hỗ trợ?
                  </CardTitle>
                  <CardDescription>
                    Đội ngũ hỗ trợ 24/7 sẵn sàng giúp bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 dark:bg-gray-800/50 rounded-lg">
                      <IconPhone className="size-4 text-primary" />
                      <div>
                        <div className="text-sm font-medium">Hotline</div>
                        <div className="text-primary font-mono">1900 1234</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 dark:bg-gray-800/50 rounded-lg">
                      <IconMail className="size-4 text-primary" />
                      <div>
                        <div className="text-sm font-medium">Email</div>
                        <div className="text-primary text-sm">support@qrordering.com</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/support">
                      Trung tâm hỗ trợ
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Câu hỏi thường gặp</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Tại sao thanh toán thất bại?</h4>
                    <p className="text-xs text-muted-foreground">
                      Có nhiều nguyên nhân như số dư không đủ, thẻ hết hạn, lỗi mạng hoặc từ ngân hàng.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Tôi có bị trừ tiền không?</h4>
                    <p className="text-xs text-muted-foreground">
                      Không, giao dịch thất bại không được xử lý và tài khoản không bị trừ tiền.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Tôi có thể thử lại không?</h4>
                    <p className="text-xs text-muted-foreground">
                      Có, bạn có thể thử lại ngay lập tức hoặc sau khi khắc phục vấn đề.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Payment */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <CardHeader>
                  <CardTitle className="text-lg">Phương thức khác</CardTitle>
                  <CardDescription>
                    Thử các cách thanh toán khác
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-medium mb-2">Chuyển khoản ngân hàng</h4>
                    <p className="text-muted-foreground text-xs mb-3">
                      Thanh toán trực tiếp qua tài khoản ngân hàng
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Xem thông tin TK
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-sm">
                    <h4 className="font-medium mb-2">Liên hệ sales</h4>
                    <p className="text-muted-foreground text-xs mb-3">
                      Được hỗ trợ trực tiếp từ đội ngũ bán hàng
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Gọi sales
                    </Button>
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
