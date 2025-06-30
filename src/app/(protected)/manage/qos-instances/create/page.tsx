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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { QosInstanceStatus } from "@/constants/qos-instance.constant";
import {
  useAddQosInstanceMutation,
  useGetQosInstanceList,
} from "@/hooks/useQosInstance";
import {
  useGetAdminSubscriptionList,
  useSubscriptionWithQosHealth,
} from "@/hooks/useSubscription";
import { useGetUserList } from "@/hooks/useUser";
import { handleErrorApi } from "@/lib/utils";
import { CreateQosInstanceBodyType } from "@/schemaValidations/qos-instance.model";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconBuilding,
  IconCheck,
  IconChevronRight,
  IconCreditCard,
  IconDatabase,
  IconGlobe,
  IconLoader2,
  IconMail,
  IconRocket,
  IconServer,
  IconSettings,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateQosInstancePage() {
  const router = useRouter();
  const addQosInstanceMutation = useAddQosInstanceMutation();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    number | null
  >(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Steps for the wizard
  const steps = [
    {
      id: 1,
      title: "Chọn khách hàng",
      description: "Chọn khách hàng và subscription",
    },
    {
      id: 2,
      title: "Cấu hình hệ thống",
      description: "Thiết lập database và server",
    },
    { id: 3, title: "Xác nhận", description: "Kiểm tra và tạo instance" },
  ];

  // Fetch data
  const { data: usersData, isLoading: isLoadingUsers } = useGetUserList({
    page: 1,
    limit: 1000,
  });
  const { data: subscriptionsData, isLoading: isLoadingSubscriptions } =
    useGetAdminSubscriptionList({ page: 1, limit: 1000 });
  const { data: qosInstancesData, isLoading: isLoadingQosInstances } =
    useGetQosInstanceList({ page: 1, limit: 1000 });
  const { data: qosHealthData } = useSubscriptionWithQosHealth(
    selectedSubscriptionId || 0
  );

  const form = useForm<CreateQosInstanceBodyType>({
    defaultValues: {
      userId: 0,
      subscriptionId: 0,
      dbName: "",
      frontEndUrl: "",
      backEndUrl: "",
      statusDb: QosInstanceStatus.INACTIVE,
      statusFE: QosInstanceStatus.INACTIVE,
      statusBE: QosInstanceStatus.INACTIVE,
      serverInfo: "",
      dbSize: 0,
      responseTime: 0,
      uptime: 0,
      version: "1.0.0",
    },
  });

  // Filter data
  const availableSubscriptions =
    subscriptionsData?.payload?.data?.filter((sub) =>
      selectedUserId ? sub.userId === selectedUserId : true
    ) || [];

  const subscriptionsWithoutQos = availableSubscriptions.filter((sub) => {
    if (sub.status !== "PAID") return false;
    const existingQosInstance = qosInstancesData?.payload?.data?.find(
      (qos) => qos.subscriptionId === sub.id
    );
    return !existingQosInstance;
  });

  const selectedUser = usersData?.payload?.data?.find(
    (u) => u.id === selectedUserId
  );
  const selectedSubscription = subscriptionsData?.payload?.data?.find(
    (s) => s.id === selectedSubscriptionId
  );

  // Statistics
  const stats = {
    totalSubscriptions: subscriptionsData?.payload?.data?.length || 0,
    paidSubscriptions:
      subscriptionsData?.payload?.data?.filter((s) => s.status === "PAID")
        .length || 0,
    totalQosInstances: qosInstancesData?.payload?.data?.length || 0,
    availableToCreate: Math.max(
      0,
      (subscriptionsData?.payload?.data?.filter((s) => s.status === "PAID")
        .length || 0) - (qosInstancesData?.payload?.data?.length || 0)
    ),
  };

  const handleUserChange = (userId: string) => {
    const userIdNum = Number(userId);
    setSelectedUserId(userIdNum);
    form.setValue("userId", userIdNum);
    form.setValue("subscriptionId", 0);
    setSelectedSubscriptionId(null);
  };

  const handleSubscriptionChange = (subscriptionId: string) => {
    const subIdNum = Number(subscriptionId);
    form.setValue("subscriptionId", subIdNum);
    setSelectedSubscriptionId(subIdNum);

    // Auto-generate database name
    const subscription = subscriptionsData?.payload?.data?.find(
      (s) => s.id === subIdNum
    );
    if (subscription) {
      const dbName = `qos_${subscription.restaurantName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${subIdNum}`;
      form.setValue("dbName", dbName);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const onSubmit = async (data: CreateQosInstanceBodyType) => {
    if (addQosInstanceMutation.isPending) return;

    if (qosHealthData?.payload?.data?.qosInstance) {
      toast.error("Subscription này đã có QOS instance. Không thể tạo thêm.");
      return;
    }

    // Validate
    if (!data.userId || data.userId <= 0) {
      form.setError("userId", {
        type: "manual",
        message: "Vui lòng chọn khách hàng",
      });
      setCurrentStep(1);
      return;
    }

    if (!data.subscriptionId || data.subscriptionId <= 0) {
      form.setError("subscriptionId", {
        type: "manual",
        message: "Vui lòng chọn subscription",
      });
      setCurrentStep(1);
      return;
    }

    if (data.frontEndUrl && !isValidUrl(data.frontEndUrl)) {
      form.setError("frontEndUrl", {
        type: "manual",
        message: "URL Frontend không hợp lệ",
      });
      setCurrentStep(2);
      return;
    }

    if (data.backEndUrl && !isValidUrl(data.backEndUrl)) {
      form.setError("backEndUrl", {
        type: "manual",
        message: "URL Backend không hợp lệ",
      });
      setCurrentStep(2);
      return;
    }

    try {
      const payload = {
        ...data,
        userId: Number(data.userId),
        subscriptionId: Number(data.subscriptionId),
        dbName: data.dbName?.trim() || undefined,
        frontEndUrl: data.frontEndUrl?.trim() || undefined,
        backEndUrl: data.backEndUrl?.trim() || undefined,
        serverInfo: data.serverInfo?.trim() || undefined,
        version: data.version?.trim() || undefined,
        dbSize: data.dbSize || undefined,
        responseTime: data.responseTime || undefined,
        uptime: data.uptime || undefined,
      };

      await addQosInstanceMutation.mutateAsync(payload);
      toast.success("Tạo QOS Instance thành công!");
      router.push("/manage/qos-instances");
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/manage/qos-instances">
                <IconArrowLeft className="size-4 mr-2" />
                Quay lại
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tạo QOS Instance mới
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Triển khai QR ordering system cho khách hàng
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Progress & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tiến trình</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                      <div key={step.id} className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                          }`}
                        >
                          {isCompleted ? (
                            <IconCheck className="size-4" />
                          ) : (
                            step.id
                          )}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`font-medium text-sm ${isActive ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
                          >
                            {step.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {step.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hoàn thành</span>
                    <span>
                      {Math.round(((currentStep - 1) / steps.length) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={((currentStep - 1) / steps.length) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thống kê hệ thống</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.totalSubscriptions}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Tổng subscription
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {stats.paidSubscriptions}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        PAID subscription
                      </div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {stats.totalQosInstances}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        QOS instances
                      </div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                      <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                        {stats.availableToCreate}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Có thể tạo mới
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Customer & Subscription Selection */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconUsers className="size-5" />
                      Chọn khách hàng và subscription
                    </CardTitle>
                    <CardDescription>
                      Chọn khách hàng và subscription PAID để tạo QOS instance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Customer Selection */}
                    <div className="space-y-3">
                      <Label htmlFor="userId" className="text-base font-medium">
                        Khách hàng <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        onValueChange={handleUserChange}
                        disabled={isLoadingUsers}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue
                            placeholder={
                              isLoadingUsers
                                ? "Đang tải khách hàng..."
                                : "Chọn khách hàng"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingUsers ? (
                            <SelectItem value="loading" disabled>
                              <div className="flex items-center gap-2">
                                <IconLoader2 className="size-3 animate-spin" />
                                Đang tải...
                              </div>
                            </SelectItem>
                          ) : (
                            usersData?.payload?.data?.map((user) => (
                              <SelectItem
                                key={user.id}
                                value={user.id.toString()}
                              >
                                <div className="flex items-center gap-3 py-2">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <IconUser className="size-4 text-primary" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {user.name || user.email}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {user.email} • ID: {user.id}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.userId && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.userId.message}
                        </p>
                      )}
                    </div>

                    {/* Customer Info Display */}
                    {selectedUser && (
                      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <IconUser className="size-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-blue-900 dark:text-blue-100">
                              {selectedUser.name || "Không có tên"}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-1">
                              <IconMail className="size-3" />
                              {selectedUser.email}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              ID: {selectedUser.id} •{" "}
                              {selectedUser.phoneNumber || "Chưa có SĐT"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Subscription Selection */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="subscriptionId"
                        className="text-base font-medium"
                      >
                        Subscription <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        onValueChange={handleSubscriptionChange}
                        disabled={
                          !selectedUserId ||
                          isLoadingSubscriptions ||
                          isLoadingQosInstances
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue
                            placeholder={
                              !selectedUserId
                                ? "Chọn khách hàng trước"
                                : isLoadingSubscriptions ||
                                    isLoadingQosInstances
                                  ? "Đang kiểm tra subscription..."
                                  : "Chọn subscription"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {subscriptionsWithoutQos.map((subscription) => (
                            <SelectItem
                              key={subscription.id}
                              value={subscription.id.toString()}
                            >
                              <div className="flex items-center gap-3 py-2">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                  <IconBuilding className="size-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {subscription.restaurantName}
                                    </span>
                                    <Badge
                                      variant="secondary"
                                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    >
                                      PAID
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {subscription.restaurantType} •{" "}
                                    {subscription.servicePlan?.name}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.subscriptionId && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.subscriptionId.message}
                        </p>
                      )}

                      {/* No available subscriptions warning */}
                      {selectedUserId &&
                        availableSubscriptions.length === 0 && (
                          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <IconAlertTriangle className="size-5 text-amber-500 mt-0.5" />
                              <div>
                                <div className="font-medium text-amber-800 dark:text-amber-200">
                                  Khách hàng này không có subscription nào
                                </div>
                                <div className="text-sm text-amber-700 dark:text-amber-300">
                                  Khách hàng cần đăng ký gói dịch vụ trước khi
                                  tạo QOS instance.
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      {selectedUserId &&
                        availableSubscriptions.length > 0 &&
                        subscriptionsWithoutQos.length === 0 && (
                          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <IconAlertTriangle className="size-5 text-amber-500 mt-0.5" />
                              <div>
                                <div className="font-medium text-amber-800 dark:text-amber-200">
                                  Không có subscription PAID khả dụng
                                </div>
                                <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                                  <div>
                                    •{" "}
                                    {
                                      availableSubscriptions.filter(
                                        (s) => s.status === "PAID"
                                      ).length
                                    }{" "}
                                    subscription PAID đã có QOS instance
                                  </div>
                                  <div>
                                    •{" "}
                                    {
                                      availableSubscriptions.filter(
                                        (s) => s.status !== "PAID"
                                      ).length
                                    }{" "}
                                    subscription chưa thanh toán
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Subscription Info Display */}
                    {selectedSubscription && (
                      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <IconBuilding className="size-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-medium text-green-900 dark:text-green-100">
                                {selectedSubscription.restaurantName}
                              </div>
                              <Badge className="bg-green-500 text-white">
                                {selectedSubscription.servicePlan?.name}
                              </Badge>
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                              <div>
                                📍 {selectedSubscription.restaurantAddress}
                              </div>
                              <div>
                                🏪 {selectedSubscription.restaurantType}
                              </div>
                              <div className="flex items-center gap-1">
                                <IconCreditCard className="size-3" />
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(
                                  selectedSubscription.servicePlan?.price || 0
                                )}
                                /tháng
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* QOS Health Check */}
                    {selectedSubscriptionId && qosHealthData?.payload && (
                      <div className="space-y-3">
                        <Label className="text-base font-medium">
                          Kiểm tra QOS Instance
                        </Label>
                        {qosHealthData.payload.data.qosInstance ? (
                          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <IconAlertTriangle className="size-5 text-red-500 mt-0.5" />
                              <div>
                                <div className="font-medium text-red-800 dark:text-red-200 mb-2">
                                  ⚠️ Subscription này đã có QOS instance
                                </div>
                                <div className="bg-white dark:bg-red-900 rounded-md p-3 text-sm space-y-1">
                                  <div>
                                    <strong>Instance ID:</strong>{" "}
                                    {qosHealthData.payload.data.qosInstance.id}
                                  </div>
                                  {qosHealthData.payload.data.qosInstance
                                    .frontEndUrl && (
                                    <div>
                                      <strong>Frontend:</strong>{" "}
                                      {
                                        qosHealthData.payload.data.qosInstance
                                          .frontEndUrl
                                      }
                                    </div>
                                  )}
                                  {qosHealthData.payload.data.qosInstance
                                    .backEndUrl && (
                                    <div>
                                      <strong>Backend:</strong>{" "}
                                      {
                                        qosHealthData.payload.data.qosInstance
                                          .backEndUrl
                                      }
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
                                  Không thể tạo instance mới cho subscription
                                  này.
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <IconCheck className="size-5 text-green-500 mt-0.5" />
                              <div>
                                <div className="font-medium text-green-800 dark:text-green-200">
                                  ✅ Có thể tạo QOS instance mới
                                </div>
                                <div className="text-sm text-green-700 dark:text-green-300">
                                  Subscription này chưa có QOS instance và đã
                                  thanh toán.
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        disabled={
                          !selectedSubscriptionId ||
                          !!qosHealthData?.payload?.data?.qosInstance
                        }
                        className="min-w-32"
                      >
                        Tiếp theo
                        <IconChevronRight className="size-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: System Configuration */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Database Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IconDatabase className="size-5" />
                        Cấu hình Database
                      </CardTitle>
                      <CardDescription>
                        Thiết lập database và thông tin lưu trữ
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dbName">Tên Database</Label>
                          <Input
                            id="dbName"
                            placeholder="qos_restaurant_001"
                            {...form.register("dbName")}
                          />
                          <p className="text-xs text-muted-foreground">
                            Tên database sẽ được tạo cho nhà hàng này
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="statusDb">Trạng thái Database</Label>
                          <Select
                            defaultValue={QosInstanceStatus.INACTIVE}
                            onValueChange={(value) =>
                              form.setValue("statusDb", value as any)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={QosInstanceStatus.INACTIVE}>
                                Không hoạt động
                              </SelectItem>
                              <SelectItem value={QosInstanceStatus.ACTIVE}>
                                Hoạt động
                              </SelectItem>
                              <SelectItem value={QosInstanceStatus.MAINTENANCE}>
                                Bảo trì
                              </SelectItem>
                              <SelectItem value={QosInstanceStatus.DEPLOYING}>
                                Đang triển khai
                              </SelectItem>
                              <SelectItem value={QosInstanceStatus.ERROR}>
                                Lỗi
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dbSize">
                            Kích thước Database (MB)
                          </Label>
                          <Input
                            id="dbSize"
                            type="number"
                            min="0"
                            placeholder="0"
                            {...form.register("dbSize", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="version">Phiên bản QOS</Label>
                          <Input
                            id="version"
                            placeholder="1.0.0"
                            {...form.register("version")}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Server Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IconServer className="size-5" />
                        Cấu hình Server
                      </CardTitle>
                      <CardDescription>
                        Thiết lập URL và trạng thái các service
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Frontend */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-3">
                            <IconGlobe className="size-5 text-blue-500" />
                            <h4 className="font-medium">Frontend Service</h4>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="frontEndUrl">URL Frontend</Label>
                            <Input
                              id="frontEndUrl"
                              type="url"
                              placeholder="https://restaurant.qos.com"
                              {...form.register("frontEndUrl")}
                            />
                            {form.formState.errors.frontEndUrl && (
                              <p className="text-sm text-destructive">
                                {form.formState.errors.frontEndUrl.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="statusFE">
                              Trạng thái Frontend
                            </Label>
                            <Select
                              defaultValue={QosInstanceStatus.INACTIVE}
                              onValueChange={(value) =>
                                form.setValue("statusFE", value as any)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={QosInstanceStatus.INACTIVE}>
                                  Không hoạt động
                                </SelectItem>
                                <SelectItem value={QosInstanceStatus.ACTIVE}>
                                  Hoạt động
                                </SelectItem>
                                <SelectItem
                                  value={QosInstanceStatus.MAINTENANCE}
                                >
                                  Bảo trì
                                </SelectItem>
                                <SelectItem value={QosInstanceStatus.DEPLOYING}>
                                  Đang triển khai
                                </SelectItem>
                                <SelectItem value={QosInstanceStatus.ERROR}>
                                  Lỗi
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Backend */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-3">
                            <IconSettings className="size-5 text-green-500" />
                            <h4 className="font-medium">Backend Service</h4>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="backEndUrl">URL Backend</Label>
                            <Input
                              id="backEndUrl"
                              type="url"
                              placeholder="https://api.restaurant.qos.com"
                              {...form.register("backEndUrl")}
                            />
                            {form.formState.errors.backEndUrl && (
                              <p className="text-sm text-destructive">
                                {form.formState.errors.backEndUrl.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="statusBE">Trạng thái Backend</Label>
                            <Select
                              defaultValue={QosInstanceStatus.INACTIVE}
                              onValueChange={(value) =>
                                form.setValue("statusBE", value as any)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={QosInstanceStatus.INACTIVE}>
                                  Không hoạt động
                                </SelectItem>
                                <SelectItem value={QosInstanceStatus.ACTIVE}>
                                  Hoạt động
                                </SelectItem>
                                <SelectItem
                                  value={QosInstanceStatus.MAINTENANCE}
                                >
                                  Bảo trì
                                </SelectItem>
                                <SelectItem value={QosInstanceStatus.DEPLOYING}>
                                  Đang triển khai
                                </SelectItem>
                                <SelectItem value={QosInstanceStatus.ERROR}>
                                  Lỗi
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <Separator className="my-6" />
                      <div className="space-y-4">
                        <h4 className="font-medium">Thông số hiệu suất</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="responseTime">
                              Response Time (ms)
                            </Label>
                            <Input
                              id="responseTime"
                              type="number"
                              min="0"
                              placeholder="0"
                              {...form.register("responseTime", {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="uptime">Uptime (%)</Label>
                            <Input
                              id="uptime"
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0"
                              {...form.register("uptime", {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Server Info */}
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="serverInfo">Thông tin Server</Label>
                        <Textarea
                          id="serverInfo"
                          placeholder="Mô tả về server, cấu hình, địa điểm..."
                          rows={3}
                          {...form.register("serverInfo")}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Navigation */}
                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                    >
                      <IconArrowLeft className="size-4 mr-2" />
                      Quay lại
                    </Button>
                    <Button type="button" onClick={() => setCurrentStep(3)}>
                      Tiếp theo
                      <IconChevronRight className="size-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Confirm */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="size-5" />
                        Xác nhận thông tin
                      </CardTitle>
                      <CardDescription>
                        Kiểm tra lại thông tin trước khi tạo QOS instance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Customer & Subscription Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium text-primary">
                            Thông tin khách hàng
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <IconUser className="size-4 text-gray-500" />
                              <span className="font-medium">
                                {selectedUser?.name || selectedUser?.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IconMail className="size-4 text-gray-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedUser?.email}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {selectedUser?.id}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-primary">
                            Thông tin subscription
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <IconBuilding className="size-4 text-gray-500" />
                              <span className="font-medium">
                                {selectedSubscription?.restaurantName}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedSubscription?.restaurantAddress}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {selectedSubscription?.servicePlan?.name}
                              </Badge>
                              <Badge className="bg-green-500 text-white">
                                PAID
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Technical Configuration */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-primary">
                          Cấu hình kỹ thuật
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                            <div className="font-medium mb-2">Database</div>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <div>
                                Tên: {form.watch("dbName") || "Chưa nhập"}
                              </div>
                              <div>Trạng thái: {form.watch("statusDb")}</div>
                              <div>
                                Kích thước: {form.watch("dbSize") || 0} MB
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                            <div className="font-medium mb-2">Services</div>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <div>Frontend: {form.watch("statusFE")}</div>
                              <div>Backend: {form.watch("statusBE")}</div>
                              <div>
                                Version: {form.watch("version") || "1.0.0"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {(form.watch("frontEndUrl") ||
                          form.watch("backEndUrl")) && (
                          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                            <div className="font-medium mb-2 text-blue-900 dark:text-blue-100">
                              URLs
                            </div>
                            <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                              {form.watch("frontEndUrl") && (
                                <div>Frontend: {form.watch("frontEndUrl")}</div>
                              )}
                              {form.watch("backEndUrl") && (
                                <div>Backend: {form.watch("backEndUrl")}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Deployment Guide */}
                      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <IconRocket className="size-5 text-amber-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                              Sau khi tạo QOS Instance
                            </div>
                            <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                              <div>1. Tạo database với tên đã chọn</div>
                              <div>
                                2. Thiết lập domain/subdomain cho nhà hàng
                              </div>
                              <div>
                                3. Deploy frontend và backend applications
                              </div>
                              <div>4. Cấu hình monitoring và backup</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Navigation */}
                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      <IconArrowLeft className="size-4 mr-2" />
                      Quay lại
                    </Button>
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" asChild>
                        <Link href="/manage/qos-instances">Hủy</Link>
                      </Button>
                      <Button
                        type="submit"
                        disabled={addQosInstanceMutation.isPending}
                        className="min-w-32"
                      >
                        {addQosInstanceMutation.isPending ? (
                          <>
                            <IconLoader2 className="size-4 mr-2 animate-spin" />
                            Đang tạo...
                          </>
                        ) : (
                          <>
                            <IconRocket className="size-4 mr-2" />
                            Tạo QOS Instance
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
