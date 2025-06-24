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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePayOSPaymentMutation } from "@/hooks/usePayment";
import { useGetServicePlan } from "@/hooks/useServicePlan";
import { useAddSubscriptionMutation, useGetSubscriptionList } from "@/hooks/useSubscription";
import { handleErrorApi } from "@/lib/utils";
import {
  CreateSubscriptionBodyType,
  DurationOptions,
  RestaurantTypeOptions,
} from "@/schemaValidations/subscription.model";
import { useAuthStore } from "@/stores/auth.store";
import {
  IconArrowLeft,
  IconBuildingStore,
  IconCheck,
  IconCreditCard,
  IconLoader2,
  IconMapPin,
  IconPackages,
  IconPhone,
  IconShield,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CheckoutFormData extends CreateSubscriptionBodyType {}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  const { user, isAuthenticated, isLoading } = useAuthStore();

  const [selectedDuration, setSelectedDuration] = useState<string>("ONE_MONTH");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if user already has pending subscription for this plan
  const { data: subscriptionsData } = useGetSubscriptionList({
    page: 1,
    limit: 100,
  });

  const addSubscriptionMutation = useAddSubscriptionMutation();
  const createPaymentMutation = useCreatePayOSPaymentMutation();

  const {
    data: planData,
    isLoading: planLoading,
    error: planError,
  } = useGetServicePlan({
    id: Number(planId),
    enabled: !!planId,
  });

  const form = useForm<CheckoutFormData>({
    defaultValues: {
      restaurantName: "",
      restaurantAddress: "",
      restaurantPhone: "",
      restaurantType: "",
      description: "",
      servicePlanId: Number(planId) || 0,
      durationDays: "ONE_MONTH",
    },
  });

  // Authentication check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login with return URL
      const returnUrl = `/checkout?planId=${planId}`;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }
  }, [isAuthenticated, isLoading, router, planId]);

  // Update form when planId changes
  useEffect(() => {
    if (planId) {
      form.setValue("servicePlanId", Number(planId));
    }
  }, [planId, form]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const calculateTotal = () => {
    if (!planData?.payload.data) return 0;
    const duration = DurationOptions.find((d) => d.value === selectedDuration);
    return planData.payload.data.price * (duration?.months || 1);
  };
  
  // Check if user has pending subscription for this plan
  const hasPendingSubscription = subscriptionsData?.payload?.data?.some(
    (sub) => sub.servicePlanId === Number(planId) && sub.status === "PENDING"
  );

  const onSubmit = async (data: CheckoutFormData) => {
    if (isSubmitting) return;

    // Validation
    if (!data.restaurantName.trim()) {
      form.setError("restaurantName", { message: "Tên nhà hàng là bắt buộc" });
      return;
    }
    if (!data.restaurantAddress.trim()) {
      form.setError("restaurantAddress", {
        message: "Địa chỉ nhà hàng là bắt buộc",
      });
      return;
    }
    if (!data.restaurantPhone.trim()) {
      form.setError("restaurantPhone", {
        message: "Số điện thoại là bắt buộc",
      });
      return;
    }
    if (!data.restaurantType) {
      form.setError("restaurantType", {
        message: "Loại hình nhà hàng là bắt buộc",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create subscription
      const subscriptionPayload: CreateSubscriptionBodyType = {
        ...data,
        durationDays: selectedDuration as any,
        description: data.description?.trim() || null,
      };

      const subscriptionResponse =
        await addSubscriptionMutation.mutateAsync(subscriptionPayload);
      const subscriptionId = subscriptionResponse.payload.data.id;

      // Step 2: Create PayOS payment
      const paymentPayload = {
        subscriptionId,
        amount: calculateTotal(),
        description: `Thanh toán gói ${planData?.payload.data.name} - ${data.restaurantName}`,
      };

      const paymentResponse =
        await createPaymentMutation.mutateAsync(paymentPayload);
      const checkoutUrl = paymentResponse.payload.data.checkoutUrl;

      // Step 3: Redirect to PayOS
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error("Không thể tạo link thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Plan loading
  if (planLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded-md" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div
                        key={j}
                        className="h-10 bg-muted animate-pulse rounded-md"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Plan error or not found
  if (planError || !planData?.payload.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-destructive mb-4">
                Không tìm thấy gói dịch vụ hoặc có lỗi xảy ra.
              </div>
              <Button asChild>
                <Link href="/plans">Quay lại chọn gói</Link>
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
              <Button variant="outline" size="sm" asChild>
                <Link href="/plans">
                  <IconArrowLeft className="size-4 mr-2" />
                  Quay lại
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Thanh toán đăng ký
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Hoàn tất thông tin để bắt đầu sử dụng dịch vụ
                </p>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Pending Subscription Warning */}
          {hasPendingSubscription && (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <IconShield className="size-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                    Bạn đã có đăng ký chờ thanh toán cho gói này
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
                    Hệ thống đã ghi nhận đăng ký trước đó của bạn cho gói này. Bạn có thể thanh toán ngay hoặc tạo đăng ký mới.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/customer/dashboard">
                      Xem đăng ký hiện tại
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Restaurant Information Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* User Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconUser className="size-5" />
                      Thông tin tài khoản
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <IconCheck className="size-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {user?.name || user?.email}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Restaurant Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconBuildingStore className="size-5" />
                      Thông tin nhà hàng
                    </CardTitle>
                    <CardDescription>
                      Điền thông tin chi tiết về nhà hàng của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Restaurant Name */}
                    <div className="space-y-2">
                      <Label htmlFor="restaurantName">
                        Tên nhà hàng <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="restaurantName"
                        placeholder="Ví dụ: Nhà hàng Phố Cổ"
                        className="dark:bg-gray-800 dark:border-gray-600"
                        {...form.register("restaurantName")}
                      />
                      {form.formState.errors.restaurantName && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.restaurantName.message}
                        </p>
                      )}
                    </div>

                    {/* Restaurant Address */}
                    <div className="space-y-2">
                      <Label htmlFor="restaurantAddress">
                        Địa chỉ <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="restaurantAddress"
                          placeholder="Số nhà, đường, phường, quận, thành phố"
                          className="pl-10"
                          {...form.register("restaurantAddress")}
                        />
                      </div>
                      {form.formState.errors.restaurantAddress && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.restaurantAddress.message}
                        </p>
                      )}
                    </div>

                    {/* Restaurant Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="restaurantPhone">
                        Số điện thoại{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="restaurantPhone"
                          placeholder="0123456789"
                          className="pl-10"
                          {...form.register("restaurantPhone")}
                        />
                      </div>
                      {form.formState.errors.restaurantPhone && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.restaurantPhone.message}
                        </p>
                      )}
                    </div>

                    {/* Restaurant Type */}
                    <div className="space-y-2">
                      <Label htmlFor="restaurantType">
                        Loại hình nhà hàng{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={form.watch("restaurantType")}
                        onValueChange={(value) =>
                          form.setValue("restaurantType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại hình nhà hàng" />
                        </SelectTrigger>
                        <SelectContent>
                          {RestaurantTypeOptions.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.restaurantType && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.restaurantType.message}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả (tùy chọn)</Label>
                      <Textarea
                        id="description"
                        placeholder="Mô tả ngắn về nhà hàng của bạn..."
                        rows={3}
                        {...form.register("description")}
                      />
                      <p className="text-xs text-muted-foreground">
                        Ví dụ: Nhà hàng chuyên về món ăn truyền thống Việt Nam
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconShoppingCart className="size-5" />
                      Tóm tắt đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Selected Plan */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconPackages className="size-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {planData.payload.data.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {planData.payload.data.description ||
                              "Gói dịch vụ chất lượng cao"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Duration Selection */}
                    <div className="space-y-3">
                      <Label>Thời gian đăng ký</Label>
                      <Select
                        value={selectedDuration}
                        onValueChange={(value) => {
                          setSelectedDuration(value);
                          form.setValue("durationDays", value as any);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DurationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center justify-between w-full">
                                <span>{option.label}</span>
                                {option.months > 1 && (
                                  <Badge variant="secondary" className="ml-2">
                                    Tiết kiệm{" "}
                                    {((1 - 1 / option.months) * 100).toFixed(0)}
                                    %
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Giá gói/tháng:</span>
                        <span>
                          {formatCurrency(planData.payload.data.price)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Thời gian:</span>
                        <span>
                          {
                            DurationOptions.find(
                              (d) => d.value === selectedDuration
                            )?.label
                          }
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Tổng cộng:</span>
                        <span className="text-primary">
                          {formatCurrency(calculateTotal())}
                        </span>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-3">
                      <Label>Phương thức thanh toán</Label>
                      <div className="p-4 bg-muted/50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                            <IconCreditCard className="size-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium dark:text-white">
                              Chuyển khoản ngân hàng
                            </div>
                            <div className="text-sm text-muted-foreground">
                              PayOS - An toàn & Bảo mật
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <IconLoader2 className="size-4 mr-2 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <IconShield className="size-4 mr-2" />
                          Thanh toán an toàn
                        </>
                      )}
                    </Button>

                    {/* Security Notice */}
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        <IconShield className="size-3 inline mr-1" />
                        Thông tin của bạn được bảo mật SSL 256-bit
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
