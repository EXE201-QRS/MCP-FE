"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  IconArrowLeft,
  IconDatabase,
  IconLoader2,
  IconServer,
  IconUsers,
} from "@tabler/icons-react";
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

  // Fetch users, subscriptions, and existing QOS instances
  const { data: usersData, isLoading: isLoadingUsers } = useGetUserList({
    page: 1,
    limit: 1000,
  });
  const { data: subscriptionsData, isLoading: isLoadingSubscriptions } =
    useGetAdminSubscriptionList({
      page: 1,
      limit: 1000,
    });
  const { data: qosInstancesData, isLoading: isLoadingQosInstances } =
    useGetQosInstanceList({
      page: 1,
      limit: 1000,
    });

  // Get QOS health info for selected subscription
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
      version: "",
    },
  });

  // Filter subscriptions by selected user
  const availableSubscriptions =
    subscriptionsData?.payload?.data?.filter((sub) =>
      selectedUserId ? sub.userId === selectedUserId : true
    ) || [];

  // Filter subscriptions that are PAID and don't have QOS instances yet
  const subscriptionsWithoutQos = availableSubscriptions.filter((sub) => {
    // Only PAID subscriptions can have QOS instances created
    if (sub.status !== "PAID") return false;

    // Check if this subscription already has a QOS instance
    const existingQosInstance = qosInstancesData?.payload?.data?.find(
      (qos) => qos.subscriptionId === sub.id
    );

    if (existingQosInstance) {
      return false; // Subscription already has QOS instance
    }

    return true; // PAID subscription without QOS instance
  });

  const onSubmit = async (data: CreateQosInstanceBodyType) => {
    if (addQosInstanceMutation.isPending) return;

    // Check if subscription already has QOS instance
    if (qosHealthData?.payload?.data?.qosInstance) {
      toast.error("Subscription này đã có QOS instance. Không thể tạo thêm.");
      return;
    }

    // Basic validation
    if (!data.userId || data.userId <= 0) {
      form.setError("userId", {
        type: "manual",
        message: "Vui lòng chọn khách hàng",
      });
      return;
    }

    if (!data.subscriptionId || data.subscriptionId <= 0) {
      form.setError("subscriptionId", {
        type: "manual",
        message: "Vui lòng chọn subscription",
      });
      return;
    }

    // Validate URLs if provided
    if (data.frontEndUrl && !isValidUrl(data.frontEndUrl)) {
      form.setError("frontEndUrl", {
        type: "manual",
        message: "URL Frontend không hợp lệ",
      });
      return;
    }

    if (data.backEndUrl && !isValidUrl(data.backEndUrl)) {
      form.setError("backEndUrl", {
        type: "manual",
        message: "URL Backend không hợp lệ",
      });
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
      router.refresh();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
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

  const handleUserChange = (userId: string) => {
    const userIdNum = Number(userId);
    setSelectedUserId(userIdNum);
    form.setValue("userId", userIdNum);
    form.setValue("subscriptionId", 0); // Reset subscription when user changes
    setSelectedSubscriptionId(null); // Reset selected subscription
  };

  const handleSubscriptionChange = (subscriptionId: string) => {
    const subIdNum = Number(subscriptionId);
    form.setValue("subscriptionId", subIdNum);
    setSelectedSubscriptionId(subIdNum);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/manage/qos-instances">
            <IconArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tạo QOS Instance mới
          </h1>
          <p className="text-muted-foreground">
            Triển khai QR ordering system cho khách hàng
          </p>
        </div>

        {/* Statistics Summary */}
        {!isLoadingSubscriptions && !isLoadingQosInstances && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thống kê hệ thống</CardTitle>
              <CardDescription>
                Tình trạng subscription và QOS instances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {subscriptionsData?.payload?.data?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tổng subscription
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {subscriptionsData?.payload?.data?.filter(
                      (s) => s.status === "PAID"
                    ).length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    PAID subscription
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {qosInstancesData?.payload?.data?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    QOS instances
                  </div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">
                    {Math.max(
                      0,
                      (subscriptionsData?.payload?.data?.filter(
                        (s) => s.status === "PAID"
                      ).length || 0) -
                        (qosInstancesData?.payload?.data?.length || 0)
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Có thể tạo mới
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUsers className="size-5" />
                Thông tin cơ bản
              </CardTitle>
              <CardDescription>
                Chọn khách hàng và subscription để tạo QOS instance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Selection */}
              <div className="space-y-2">
                <Label htmlFor="userId">
                  Khách hàng <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={handleUserChange}
                  disabled={isLoadingUsers}
                >
                  <SelectTrigger>
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
                        <SelectItem key={user.id} value={user.id.toString()}>
                          <div className="flex flex-col">
                            <span>{user.name || user.email}</span>
                            <span className="text-xs text-muted-foreground">
                              {user.email} • ID: {user.id}
                            </span>
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

              {/* Subscription Selection */}
              <div className="space-y-2">
                <Label htmlFor="subscriptionId">
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
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !selectedUserId
                          ? "Chọn khách hàng trước"
                          : isLoadingSubscriptions || isLoadingQosInstances
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
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span>{subscription.restaurantName}</span>
                            <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-md">
                              PAID
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {subscription.restaurantType} •{" "}
                            {subscription.servicePlan?.name}
                          </span>
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
                {selectedUserId && availableSubscriptions.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Khách hàng này không có subscription nào.
                  </p>
                )}
                {selectedUserId &&
                  availableSubscriptions.length > 0 &&
                  subscriptionsWithoutQos.length === 0 && (
                    <div className="text-sm space-y-1">
                      <p className="text-amber-600">
                        ⚠️ Khách hàng này không có subscription PAID nào chưa có
                        QOS instance.
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {availableSubscriptions.filter(
                          (s) => s.status === "PAID"
                        ).length > 0 ? (
                          <p>
                            • Có{" "}
                            {
                              availableSubscriptions.filter(
                                (s) => s.status === "PAID"
                              ).length
                            }{" "}
                            subscription PAID nhưng đã có QOS instance
                          </p>
                        ) : (
                          <p>• Không có subscription PAID nào</p>
                        )}
                        {availableSubscriptions.filter(
                          (s) => s.status !== "PAID"
                        ).length > 0 && (
                          <p>
                            • Có{" "}
                            {
                              availableSubscriptions.filter(
                                (s) => s.status !== "PAID"
                              ).length
                            }{" "}
                            subscription khác (
                            {availableSubscriptions
                              .filter((s) => s.status !== "PAID")
                              .map((s) => s.status)
                              .join(", ")}
                            )
                          </p>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {selectedSubscriptionId && qosHealthData?.payload && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Kiểm tra QOS Instance
                    </CardTitle>
                    <CardDescription>
                      Kết quả kiểm tra cho subscription đã chọn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {qosHealthData.payload.data.qosInstance ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium text-red-600">
                            Subscription này đã có QOS instance
                          </span>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                          <div className="text-sm space-y-1">
                            <p>
                              <strong>QOS Instance ID:</strong>{" "}
                              {qosHealthData.payload.data.qosInstance.id}
                            </p>
                            {qosHealthData.payload.data.qosInstance
                              .backEndUrl && (
                              <p>
                                <strong>Backend URL:</strong>{" "}
                                {
                                  qosHealthData.payload.data.qosInstance
                                    .backEndUrl
                                }
                              </p>
                            )}
                            {qosHealthData.payload.data.qosInstance
                              .frontEndUrl && (
                              <p>
                                <strong>Frontend URL:</strong>{" "}
                                {
                                  qosHealthData.payload.data.qosInstance
                                    .frontEndUrl
                                }
                              </p>
                            )}
                          </div>
                          {qosHealthData.payload.data.healthCheck && (
                            <div className="mt-2 text-xs text-muted-foreground space-y-1">
                              <p className="font-medium">Thống kê hiện tại:</p>
                              <div className="grid grid-cols-2 gap-1">
                                <span>
                                  • Users:{" "}
                                  {qosHealthData.payload.data.healthCheck
                                    .amountUser || 0}
                                </span>
                                <span>
                                  • Tables:{" "}
                                  {qosHealthData.payload.data.healthCheck
                                    .amountTable || 0}
                                </span>
                                <span>
                                  • Orders:{" "}
                                  {qosHealthData.payload.data.healthCheck
                                    .amountOrder || 0}
                                </span>
                                <span>
                                  • Storage:{" "}
                                  {qosHealthData.payload.data.healthCheck
                                    .usedStorage || "0 MB"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-red-600 font-medium">
                          ⚠️ Tạo instance mới cho subscription này có thể gây
                          xung đột dữ liệu và lỗi hệ thống.
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-green-600">
                            Subscription này chưa có QOS instance
                          </span>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-md p-3">
                          <p className="text-sm text-green-700">
                            ✅ Có thể tạo QOS instance mới cho subscription này.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Hệ thống sẽ tạo database, triển khai
                            frontend/backend và cấu hình monitoring.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Version */}
              <div className="space-y-2">
                <Label htmlFor="version">Phiên bản</Label>
                <Input
                  id="version"
                  placeholder="1.0.0"
                  {...form.register("version")}
                />
                <p className="text-xs text-muted-foreground">
                  Phiên bản QR ordering system
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Database Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconDatabase className="size-5" />
                Cấu hình Database
              </CardTitle>
              <CardDescription>Thiết lập database cho instance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Database Name */}
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

              {/* Database Status */}
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
                    <SelectItem value={QosInstanceStatus.ERROR}>Lỗi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Database Size */}
              <div className="space-y-2">
                <Label htmlFor="dbSize">Kích thước Database (MB)</Label>
                <Input
                  id="dbSize"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...form.register("dbSize", { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Kích thước database hiện tại (MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

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
            <div className="grid gap-6 md:grid-cols-2">
              {/* Frontend Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium">Frontend</h4>

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
                  <Label htmlFor="statusFE">Trạng thái Frontend</Label>
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
              </div>

              {/* Backend Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium">Backend</h4>

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
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-6 md:grid-cols-2 mt-6">
              <div className="space-y-2">
                <Label htmlFor="responseTime">Response Time (ms)</Label>
                <Input
                  id="responseTime"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...form.register("responseTime", { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Thời gian phản hồi trung bình (milliseconds)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="uptime">Uptime (%)</Label>
                <Input
                  id="uptime"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  {...form.register("uptime", { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Tỷ lệ thời gian hoạt động (%)
                </p>
              </div>
            </div>

            {/* Server Info */}
            <div className="space-y-2 mt-6">
              <Label htmlFor="serverInfo">Thông tin Server</Label>
              <Textarea
                id="serverInfo"
                placeholder="Mô tả về server, cấu hình, địa điểm..."
                rows={3}
                {...form.register("serverInfo")}
              />
              <p className="text-xs text-muted-foreground">
                Thông tin bổ sung về server (specs, location, etc.)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn triển khai</CardTitle>
            <CardDescription>
              Các bước cần thực hiện sau khi tạo QOS Instance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Bước 1-3: Chuẩn bị</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Tạo database mới với tên đã chọn</li>
                  <li>• Thiết lập domain/subdomain cho nhà hàng</li>
                  <li>• Chuẩn bị SSL certificate</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Bước 4-6: Triển khai</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Deploy frontend application</li>
                  <li>• Deploy backend API service</li>
                  <li>• Cấu hình monitoring và backup</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={addQosInstanceMutation.isPending}
            className="flex-1"
          >
            {addQosInstanceMutation.isPending ? (
              <>
                <IconLoader2 className="size-4 mr-2 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo QOS Instance"
            )}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/manage/qos-instances">Hủy</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
