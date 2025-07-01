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
  useGetQosInstance,
  useUpdateQosInstanceMutation,
} from "@/hooks/useQosInstance";
import { handleErrorApi } from "@/lib/utils";
import { UpdateQosInstanceBodyType } from "@/schemaValidations/qos-instance.model";
import {
  IconActivity,
  IconArrowLeft,
  IconCheck,
  IconDatabase,
  IconLoader2,
  IconRefresh,
  IconServer,
} from "@tabler/icons-react";
import { Wrench } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditQosInstancePage() {
  const params = useParams();
  const router = useRouter();
  const instanceId = Number(params.id);

  const { data, isLoading, error } = useGetQosInstance({
    id: instanceId,
    enabled: !!instanceId,
  });
  const updateQosInstanceMutation = useUpdateQosInstanceMutation();

  const instance = data?.payload.data;

  const form = useForm<UpdateQosInstanceBodyType>({
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

  // Update form when instance data is loaded
  useEffect(() => {
    if (instance) {
      form.reset({
        userId: instance.userId,
        subscriptionId: instance.subscriptionId,
        dbName: instance.dbName || "",
        frontEndUrl: instance.frontEndUrl || "",
        backEndUrl: instance.backEndUrl || "",
        statusDb: instance.statusDb,
        statusFE: instance.statusFE,
        statusBE: instance.statusBE,
        serverInfo: instance.serverInfo || "",
        dbSize: instance.dbSize || 0,
        responseTime: instance.responseTime || 0,
        uptime: instance.uptime || 0,
        version: instance.version || "",
      });
    }
  }, [instance, form]);

  const onSubmit = async (data: UpdateQosInstanceBodyType) => {
    if (updateQosInstanceMutation.isPending) return;

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
      // Prepare payload, removing unchanged fields
      const payload: UpdateQosInstanceBodyType = {
        userId: 0,
        subscriptionId: 0,
      };

      if (data.dbName !== instance?.dbName) {
        payload.dbName = data.dbName?.trim() || undefined;
      }

      if (data.frontEndUrl !== instance?.frontEndUrl) {
        payload.frontEndUrl = data.frontEndUrl?.trim() || undefined;
      }

      if (data.backEndUrl !== instance?.backEndUrl) {
        payload.backEndUrl = data.backEndUrl?.trim() || undefined;
      }

      if (data.statusDb !== instance?.statusDb) {
        payload.statusDb = data.statusDb;
      }

      if (data.statusFE !== instance?.statusFE) {
        payload.statusFE = data.statusFE;
      }

      if (data.statusBE !== instance?.statusBE) {
        payload.statusBE = data.statusBE;
      }

      if (data.serverInfo !== instance?.serverInfo) {
        payload.serverInfo = data.serverInfo?.trim() || undefined;
      }

      if (data.dbSize !== instance?.dbSize) {
        payload.dbSize = data.dbSize || undefined;
      }

      if (data.responseTime !== instance?.responseTime) {
        payload.responseTime = data.responseTime || undefined;
      }

      if (data.uptime !== instance?.uptime) {
        payload.uptime = data.uptime || undefined;
      }

      if (data.version !== instance?.version) {
        payload.version = data.version?.trim() || undefined;
      }

      // Include required fields
      payload.userId = instance!.userId;
      payload.subscriptionId = instance!.subscriptionId;

      // Only update if there are changes
      if (Object.keys(payload).length <= 2) {
        // Only userId and subscriptionId
        toast.info("Không có thay đổi nào để cập nhật");
        return;
      }

      await updateQosInstanceMutation.mutateAsync({
        id: instanceId,
        ...payload,
      });

      toast.success("Cập nhật QOS Instance thành công!");
      router.push(`/manage/qos-instances/${instanceId}`);
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

  const handleQuickActions = {
    deployAll: () => {
      form.setValue("statusDb", QosInstanceStatus.DEPLOYING);
      form.setValue("statusFE", QosInstanceStatus.DEPLOYING);
      form.setValue("statusBE", QosInstanceStatus.DEPLOYING);
      toast.info("Đã cập nhật trạng thái thành 'Đang triển khai'");
    },
    activateAll: () => {
      form.setValue("statusDb", QosInstanceStatus.ACTIVE);
      form.setValue("statusFE", QosInstanceStatus.ACTIVE);
      form.setValue("statusBE", QosInstanceStatus.ACTIVE);
      toast.info("Đã cập nhật trạng thái thành 'Hoạt động'");
    },
    maintenanceAll: () => {
      form.setValue("statusDb", QosInstanceStatus.MAINTENANCE);
      form.setValue("statusFE", QosInstanceStatus.MAINTENANCE);
      form.setValue("statusBE", QosInstanceStatus.MAINTENANCE);
      toast.info("Đã cập nhật trạng thái thành 'Bảo trì'");
    },
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded-md w-1/3" />
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !instance) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-destructive mb-2">
                Không thể tải thông tin QOS Instance
              </div>
              <Button asChild>
                <Link href="/manage/qos-instances">
                  <IconArrowLeft className="size-4 mr-2" />
                  Quay lại danh sách
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/manage/qos-instances/${instanceId}`}>
            <IconArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Chỉnh sửa QOS Instance
          </h1>
          <p className="text-muted-foreground">
            {instance.subscription.restaurantName} • ID: {instance.id}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconRefresh className="size-5" />
              Thao tác nhanh
            </CardTitle>
            <CardDescription>
              Cập nhật trạng thái tất cả services cùng lúc
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleQuickActions.deployAll}
              >
                <IconRefresh className="size-4 mr-2" />
                Triển khai tất cả
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleQuickActions.activateAll}
              >
                <IconCheck className="size-4 mr-2" />
                Kích hoạt tất cả
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleQuickActions.maintenanceAll}
              >
                <Wrench className="size-4 mr-2" />
                Bảo trì tất cả
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Database Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconDatabase className="size-5" />
                Cấu hình Database
              </CardTitle>
              <CardDescription>
                Quản lý database và cấu hình liên quan
              </CardDescription>
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
                  Tên database cho nhà hàng này
                </p>
              </div>

              {/* Database Status */}
              <div className="space-y-2">
                <Label htmlFor="statusDb">Trạng thái Database</Label>
                <Select
                  value={form.watch("statusDb")}
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
            <CardContent className="space-y-6">
              {/* Frontend Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium">Frontend Service</h4>

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
                    value={form.watch("statusFE")}
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
                <h4 className="font-medium">Backend Service</h4>

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
                    value={form.watch("statusBE")}
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
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconActivity className="size-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Cập nhật thông số hiệu suất hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
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
                  step="0.1"
                  placeholder="0"
                  {...form.register("uptime", { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Tỷ lệ thời gian hoạt động (%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Server Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Server</CardTitle>
            <CardDescription>
              Mô tả về cấu hình server và infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="serverInfo">Thông tin Server</Label>
              <Textarea
                id="serverInfo"
                placeholder="Mô tả về server, cấu hình, địa điểm, specs..."
                rows={4}
                {...form.register("serverInfo")}
              />
              <p className="text-xs text-muted-foreground">
                Thông tin bổ sung về server (specs, location, configuration,
                etc.)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Instance Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Instance</CardTitle>
            <CardDescription>
              Thông tin không thể chỉnh sửa về instance này
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Khách hàng:</span>
                  <span>{instance.user.name || instance.user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nhà hàng:</span>
                  <span>{instance.subscription.restaurantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subscription ID:
                  </span>
                  <span>{instance.subscriptionId}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <span>
                    {new Date(instance.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Cập nhật lần cuối:
                  </span>
                  <span>
                    {new Date(instance.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instance ID:</span>
                  <span>{instance.id}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={updateQosInstanceMutation.isPending}
            className="flex-1"
          >
            {updateQosInstanceMutation.isPending ? (
              <>
                <IconLoader2 className="size-4 mr-2 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật QOS Instance"
            )}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={`/manage/qos-instances/${instanceId}`}>Hủy</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
