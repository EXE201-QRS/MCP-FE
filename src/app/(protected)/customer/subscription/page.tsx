"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetServicePlanList } from "@/hooks/useServicePlan";
import {
  useGetSubscription,
  useGetSubscriptionQosHealth,
  useUpdateSubscriptionMutation,
} from "@/hooks/useSubscription";
import {
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconCreditCard,
  IconDatabase,
  IconExternalLink,
  IconEye,
  IconGlobe,
  IconRefresh,
  IconServer,
  IconShield,
  IconStar,
  IconTrendingUp,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const getStatusBadge = (status: string) => {
  const statusConfig = {
    PENDING: {
      label: "Chờ thanh toán",
      variant: "secondary" as const,
      className:
        "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400",
    },
    PAID: {
      label: "Đã thanh toán",
      variant: "default" as const,
      className:
        "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400",
    },
    ACTIVE: {
      label: "Đang hoạt động",
      variant: "default" as const,
      className:
        "bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400",
    },
    EXPIRED: {
      label: "Hết hạn",
      variant: "destructive" as const,
      className: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400",
    },
    CANCELLED: {
      label: "Đã hủy",
      variant: "destructive" as const,
      className:
        "bg-gray-500/10 text-gray-700 border-gray-200 dark:text-gray-400",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    variant: "secondary" as const,
    className: "",
  };

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

const getServiceStatusBadge = (status: string) => {
  const statusConfig = {
    ACTIVE: {
      label: "Hoạt động",
      variant: "default" as const,
      className:
        "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400",
    },
    INACTIVE: {
      label: "Không hoạt động",
      variant: "secondary" as const,
      className:
        "bg-gray-500/10 text-gray-700 border-gray-200 dark:text-gray-400",
    },
    MAINTENANCE: {
      label: "Bảo trì",
      variant: "outline" as const,
      className:
        "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400",
    },
    DEPLOYING: {
      label: "Đang triển khai",
      variant: "outline" as const,
      className:
        "bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400",
    },
    ERROR: {
      label: "Lỗi",
      variant: "destructive" as const,
      className: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    variant: "secondary" as const,
    className: "",
  };

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export default function CustomerSubscriptionPage() {
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get("id");

  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription,
    error: subscriptionError,
    refetch: refetchSubscription,
    isFetching: isFetchingSubscription,
  } = useGetSubscription({
    id: Number(subscriptionId),
    enabled: !!subscriptionId,
  });

  const {
    data: qosHealthData,
    isLoading: isLoadingQosHealth,
    refetch: refetchQosHealth,
    isFetching: isFetchingQosHealth,
  } = useGetSubscriptionQosHealth({
    id: Number(subscriptionId),
    enabled: !!subscriptionId,
  });

  const { data: servicePlansData, isLoading: isLoadingServicePlans } =
    useGetServicePlanList({ page: 1, limit: 100 });

  const updateSubscriptionMutation = useUpdateSubscriptionMutation();

  const subscription = subscriptionData?.payload?.data;
  const qosHealth = qosHealthData?.payload?.data;
  const servicePlans = servicePlansData?.payload?.data || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatBytes = (bytes: string | null) => {
    if (!bytes) return "0 MB";
    const sizeInMB = parseFloat(bytes);
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const calculateUsagePercentage = (current: number, max: number) => {
    if (max === 0) return 0;
    return Math.min((current / max) * 100, 100);
  };

  const handleRefreshData = async () => {
    try {
      await Promise.all([refetchSubscription(), refetchQosHealth()]);
      toast.success("Đã cập nhật dữ liệu thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải dữ liệu");
    }
  };

  if (!subscriptionId) {
    return (
      <div className="space-y-6 p-6">
        <Alert>
          <IconAlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vui lòng cung cấp ID subscription trong URL (?id=123)
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoadingSubscription || isLoadingServicePlans) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 bg-muted animate-pulse rounded-md w-1/3" />
        <div className="grid gap-6">
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (subscriptionError || !subscription) {
    return (
      <div className="space-y-6 p-6">
        <Alert>
          <IconAlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Không thể tải thông tin subscription. Vui lòng kiểm tra lại ID hoặc
            thử lại sau.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentPlan = subscription.servicePlan;
  const qosInstance = qosHealth?.qosInstance;
  const healthCheck = qosHealth?.healthCheck;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý gói dịch vụ
          </h1>
          <p className="text-muted-foreground">
            {subscription.restaurantName} • {subscription.restaurantType}
          </p>
        </div>
        <Button
          onClick={handleRefreshData}
          variant="outline"
          disabled={isFetchingSubscription || isFetchingQosHealth}
        >
          <IconRefresh
            className={`size-4 mr-2 ${isFetchingSubscription || isFetchingQosHealth ? "animate-spin" : ""}`}
          />
          {isFetchingSubscription || isFetchingQosHealth
            ? "Đang tải..."
            : "Làm mới"}
        </Button>
      </div>

      {/* Subscription Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconShield className="size-5" />
                Thông tin subscription
              </CardTitle>
              <CardDescription>
                Trạng thái và thông tin cơ bản về gói dịch vụ
              </CardDescription>
            </div>
            {getStatusBadge(subscription.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Gói dịch vụ</div>
              <div className="font-medium">{currentPlan.name}</div>
              <div className="text-sm">
                {formatCurrency(currentPlan.price)}/tháng
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Ngày bắt đầu</div>
              <div className="font-medium">
                {subscription.startDate
                  ? format(new Date(subscription.startDate), "dd/MM/yyyy", {
                      locale: vi,
                    })
                  : "Chưa có"}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Ngày hết hạn</div>
              <div className="font-medium">
                {subscription.endDate
                  ? format(new Date(subscription.endDate), "dd/MM/yyyy", {
                      locale: vi,
                    })
                  : "Chưa có"}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Thời gian còn lại
              </div>
              <div className="font-medium">
                {subscription.endDate
                  ? Math.max(
                      0,
                      Math.ceil(
                        (new Date(subscription.endDate).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )
                  : 0}{" "}
                ngày
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QOS Instance Status */}
      {qosInstance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconServer className="size-5" />
              Trạng thái hệ thống QOS
            </CardTitle>
            <CardDescription>
              Tình trạng hoạt động của các dịch vụ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Frontend Service */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <IconGlobe className="size-4 text-blue-500" />
                  <span className="font-medium">Frontend</span>
                </div>
                {getServiceStatusBadge(qosInstance.statusFE)}
                {qosInstance.frontEndUrl && (
                  <div className="text-sm">
                    <a
                      href={qosInstance.frontEndUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Truy cập website
                      <IconExternalLink className="size-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Backend Service */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <IconServer className="size-4 text-green-500" />
                  <span className="font-medium">Backend</span>
                </div>
                {getServiceStatusBadge(qosInstance.statusBE)}
                {qosInstance.backEndUrl && (
                  <div className="text-sm text-muted-foreground">
                    API Server hoạt động
                  </div>
                )}
              </div>

              {/* Database Service */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <IconDatabase className="size-4 text-purple-500" />
                  <span className="font-medium">Database</span>
                </div>
                {getServiceStatusBadge(qosInstance.statusDb)}
                <div className="text-sm text-muted-foreground">
                  Lưu trữ dữ liệu
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Statistics */}
      {healthCheck && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTrendingUp className="size-5" />
              Thống kê sử dụng
            </CardTitle>
            <CardDescription>
              Mức độ sử dụng hiện tại so với giới hạn gói dịch vụ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Users */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Người dùng</span>
                  <span>{healthCheck.amountUser || 0}/Không giới hạn</span>
                </div>
                <Progress
                  value={
                    healthCheck.amountUser
                      ? Math.min((healthCheck.amountUser / 100) * 100, 100)
                      : 0
                  }
                />
                <div className="text-xs text-muted-foreground">
                  Nhân viên đang sử dụng hệ thống
                </div>
              </div>

              {/* Tables */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Bàn</span>
                  <span>{healthCheck.amountTable || 0}/Không giới hạn</span>
                </div>
                <Progress
                  value={
                    healthCheck.amountTable
                      ? Math.min((healthCheck.amountTable / 50) * 100, 100)
                      : 0
                  }
                />
                <div className="text-xs text-muted-foreground">
                  Số bàn đã thiết lập
                </div>
              </div>

              {/* Orders */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Đơn hàng tháng này</span>
                  <span>{healthCheck.amountOrder || 0}</span>
                </div>
                <Progress
                  value={
                    healthCheck.amountOrder
                      ? Math.min((healthCheck.amountOrder / 1000) * 100, 100)
                      : 0
                  }
                />
                <div className="text-xs text-muted-foreground">
                  Tổng đơn hàng đã xử lý
                </div>
              </div>

              {/* Storage */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Lưu trữ</span>
                  <span>{formatBytes(healthCheck.usedStorage)}</span>
                </div>
                <Progress
                  value={
                    healthCheck.usedStorage
                      ? Math.min(
                          (parseFloat(healthCheck.usedStorage) / 1024) * 100,
                          100
                        )
                      : 0
                  }
                />
                <div className="text-xs text-muted-foreground">
                  Dung lượng đã sử dụng
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Service Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCreditCard className="size-5" />
            Các gói dịch vụ khả dụng
          </CardTitle>
          <CardDescription>
            So sánh và nâng cấp gói dịch vụ của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-3">
            {servicePlans.map((plan) => {
              const isCurrentPlan = plan.id === subscription.servicePlanId;

              return (
                <Card
                  key={plan.id}
                  className={`relative ${
                    isCurrentPlan
                      ? "border-primary ring-2 ring-primary/10 shadow-lg"
                      : "border-border/50"
                  }`}
                >
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <IconStar className="mr-1 size-3" />
                        Gói hiện tại
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <div className="text-3xl font-bold">
                        {formatCurrency(plan.price)}
                        <span className="text-lg font-normal text-muted-foreground">
                          /tháng
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Tính năng chính:</p>
                      <ul className="space-y-2 text-sm">
                        {[
                          plan.name === "Basic"
                            ? "Tối đa 10 bàn"
                            : plan.name === "Professional"
                              ? "Tối đa 30 bàn"
                              : "Không giới hạn bàn",
                          plan.name === "Basic"
                            ? "5 nhân viên"
                            : plan.name === "Professional"
                              ? "15 nhân viên"
                              : "Không giới hạn nhân viên",
                          "Dashboard quản lý",
                          "Thanh toán online",
                          "Hỗ trợ kỹ thuật",
                        ].map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <IconCheck className="size-4 text-primary shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : "default"}
                      disabled={
                        isCurrentPlan || subscription.status !== "ACTIVE"
                      }
                    >
                      {isCurrentPlan ? (
                        "Gói hiện tại"
                      ) : subscription.status !== "ACTIVE" ? (
                        "Cần kích hoạt trước"
                      ) : (
                        <>
                          <IconCreditCard className="mr-2 size-4" />
                          {plan.price < currentPlan.price
                            ? "Hạ cấp"
                            : "Nâng cấp"}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>
            Các hành động thường dùng cho subscription của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <IconEye className="size-4" />
                  <span className="font-medium">Xem chi tiết</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Chi tiết subscription và lịch sử
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              asChild
            >
              <Link href="/customer/payments">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <IconCreditCard className="size-4" />
                    <span className="font-medium">Lịch sử thanh toán</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Xem các giao dịch đã thực hiện
                  </div>
                </div>
              </Link>
            </Button>

            {qosInstance?.frontEndUrl && (
              <Button
                variant="outline"
                className="h-auto p-4 justify-start"
                asChild
              >
                <a
                  href={qosInstance.frontEndUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <IconGlobe className="size-4" />
                      <span className="font-medium">Truy cập website</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Mở trang web nhà hàng
                    </div>
                  </div>
                </a>
              </Button>
            )}

            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <IconClock className="size-4" />
                  <span className="font-medium">Gia hạn</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Gia hạn thêm thời gian sử dụng
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
