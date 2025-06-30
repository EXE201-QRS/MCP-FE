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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  useSubscription,
  useUpdateSubscriptionMutation,
} from "@/hooks/useSubscription";
import {
  IconArrowLeft,
  IconBuildingStore,
  IconCalendar,
  IconCreditCard,
  IconEdit,
  IconHistory,
  IconMail,
  IconMapPin,
  IconPackages,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
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

export default function AdminSubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subscriptionId = parseInt(params.id as string);
  const updateMutation = useUpdateSubscriptionMutation();
  const [newStatus, setNewStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: subscription,
    isLoading,
    refetch,
  } = useSubscription(subscriptionId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || !subscription) return;

    setIsUpdating(true);
    
    // Only send the fields that are allowed in UpdateSubscriptionBodyType
    const updateData = {
      userId: subscription.payload.data.userId,
      restaurantName: subscription.payload.data.restaurantName,
      restaurantAddress: subscription.payload.data.restaurantAddress,
      restaurantPhone: subscription.payload.data.restaurantPhone,
      restaurantType: subscription.payload.data.restaurantType,
      description: subscription.payload.data.description,
      servicePlanId: subscription.payload.data.servicePlanId,
      durationDays: subscription.payload.data.durationDays,
      startDate: subscription.payload.data.startDate ? new Date(subscription.payload.data.startDate) : null,
      endDate: subscription.payload.data.endDate ? new Date(subscription.payload.data.endDate) : null,
      ...(newStatus && { status: newStatus as "PENDING" | "PAID" | "ACTIVE" | "EXPIRED" | "CANCELLED" }), // Only include status if it's being updated
    };
    
    try {
      await updateMutation.mutateAsync({
        ...updateData,
        id: subscriptionId,
      });
      toast.success("Cập nhật trạng thái thành công");
      // No need to call refetch() anymore, React Query will auto-invalidate
      router.push("/manage/subscriptions");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
      setNewStatus("");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 bg-muted animate-pulse rounded-md w-1/3" />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy đăng ký</h3>
          <p className="text-muted-foreground mb-6">
            Đăng ký dịch vụ với ID {subscriptionId} không tồn tại
          </p>
          <Button asChild>
            <Link href="/manage/subscriptions">
              <IconArrowLeft className="size-4 mr-2" />
              Quay lại danh sách
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const subscriptionData = subscription.payload.data;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/manage/subscriptions">
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Chi tiết đăng ký #{subscriptionData.id}
            </h1>
            <p className="text-muted-foreground">
              Thông tin chi tiết đăng ký dịch vụ
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(subscriptionData.status)}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Restaurant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBuildingStore className="size-5" />
              Thông tin nhà hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconBuildingStore className="size-4" />
                <span>Tên nhà hàng</span>
              </div>
              <p className="font-semibold text-lg">
                {subscriptionData.restaurantName}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconMapPin className="size-4" />
                <span>Địa chỉ</span>
              </div>
              <p>{subscriptionData.restaurantAddress}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconPhone className="size-4" />
                <span>Số điện thoại</span>
              </div>
              <p>{subscriptionData.restaurantPhone}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconBuildingStore className="size-4" />
                <span>Loại hình</span>
              </div>
              <Badge variant="outline">{subscriptionData.restaurantType}</Badge>
            </div>

            {subscriptionData.description && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Mô tả</span>
                </div>
                <p className="text-sm">{subscriptionData.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUser className="size-5" />
              Thông tin khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconUser className="size-4" />
                <span>Tên khách hàng</span>
              </div>
              <p className="font-semibold text-lg">
                {subscriptionData.user?.name || "N/A"}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconMail className="size-4" />
                <span>Email</span>
              </div>
              <p>{subscriptionData.user?.email || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCalendar className="size-4" />
                <span>Ngày đăng ký</span>
              </div>
              <p>
                {format(
                  new Date(subscriptionData.createdAt),
                  "dd/MM/yyyy 'lúc' HH:mm",
                  {
                    locale: vi,
                  }
                )}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconHistory className="size-4" />
                <span>Cập nhật gần nhất</span>
              </div>
              <p>
                {format(
                  new Date(subscriptionData.updatedAt),
                  "dd/MM/yyyy 'lúc' HH:mm",
                  {
                    locale: vi,
                  }
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Plan Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconPackages className="size-5" />
              Gói dịch vụ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconPackages className="size-4" />
                <span>Tên gói</span>
              </div>
              <p className="font-semibold text-lg">
                {subscriptionData.servicePlan?.name}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCreditCard className="size-4" />
                <span>Giá</span>
              </div>
              <p className="font-bold text-xl text-green-600">
                {formatCurrency(subscriptionData.servicePlan?.price || 0)}
                <span className="text-sm text-muted-foreground font-normal">
                  /tháng
                </span>
              </p>
            </div>

            {subscriptionData.servicePlan?.description && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Mô tả gói</span>
                </div>
                <p className="text-sm">
                  {subscriptionData.servicePlan.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Status & Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconEdit className="size-5" />
              Quản lý trạng thái
            </CardTitle>
            <CardDescription>
              Cập nhật trạng thái đăng ký dịch vụ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Trạng thái hiện tại</span>
              </div>
              {getStatusBadge(subscriptionData.status)}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Cập nhật trạng thái
                </label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái mới" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                    <SelectItem value="PAID">Đã thanh toán</SelectItem>
                    <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                    <SelectItem value="EXPIRED">Hết hạn</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleStatusUpdate}
                disabled={!newStatus || isUpdating}
                className="w-full"
              >
                {isUpdating ? "Đang cập nhật..." : "Cập nhật trạng thái"}
              </Button>
            </div>

            <Separator />

            {subscriptionData.startDate && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconCalendar className="size-4" />
                  <span>Ngày bắt đầu</span>
                </div>
                <p>
                  {format(new Date(subscriptionData.startDate), "dd/MM/yyyy", {
                    locale: vi,
                  })}
                </p>
              </div>
            )}

            {subscriptionData.endDate && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconCalendar className="size-4" />
                  <span>Ngày hết hạn</span>
                </div>
                <p>
                  {format(new Date(subscriptionData.endDate), "dd/MM/yyyy", {
                    locale: vi,
                  })}
                </p>
              </div>
            )}

            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link
                  href={`/manage/payments?subscriptionId=${subscriptionData.id}`}
                >
                  <IconCreditCard className="size-4 mr-2" />
                  Xem lịch sử thanh toán
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
