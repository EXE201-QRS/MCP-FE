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
import { Textarea } from "@/components/ui/textarea";
import {
  useGetServicePlan,
  useUpdateServicePlanMutation,
} from "@/hooks/useServicePlan";
import { handleErrorApi } from "@/lib/utils";
import { UpdateServicePlanBodyType } from "@/schemaValidations/service-plan.model";
import { IconArrowLeft, IconLoader2, IconPackages } from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditServicePlanPage() {
  const params = useParams();
  const router = useRouter();
  const servicePlanId = Number(params.id);

  const { data, isLoading, error } = useGetServicePlan({
    id: servicePlanId,
    enabled: !!servicePlanId,
  });
  const updateServicePlanMutation = useUpdateServicePlanMutation();

  const form = useForm<UpdateServicePlanBodyType>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (data?.payload) {
      form.reset({
        name: data.payload.data.name || "",
        description: data.payload.data.description || "",
        price: data.payload.data.price,
      });
    }
  }, [data, form]);

  const onSubmit = async (formData: UpdateServicePlanBodyType) => {
    if (updateServicePlanMutation.isPending) return;

    // Basic validation
    if (!formData.name.trim()) {
      form.setError("name", {
        type: "manual",
        message: "Tên gói dịch vụ là bắt buộc",
      });
      return;
    }

    if (formData.price < 0) {
      form.setError("price", {
        type: "manual",
        message: "Giá phải lớn hơn hoặc bằng 0",
      });
      return;
    }

    try {
      const payload = {
        id: servicePlanId,
        ...formData,
        description: formData.description?.trim() || null,
      };

      await updateServicePlanMutation.mutateAsync(payload);
      toast.success("Cập nhật gói dịch vụ thành công!");
      router.push("/manage/service-plans");
      router.refresh();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded-md" />
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded-md" />
              <div className="h-4 bg-muted animate-pulse rounded-md w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded-md w-1/3" />
                  <div className="h-10 bg-muted animate-pulse rounded-md" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !data?.payload) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Không tìm thấy gói dịch vụ hoặc có lỗi xảy ra.
            </div>
            <div className="text-center mt-4">
              <Button asChild>
                <Link href="/manage/service-plans">Quay lại danh sách</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/manage/service-plans">
            <IconArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Chỉnh sửa gói dịch vụ
          </h1>
          <p className="text-muted-foreground">
            Cập nhật thông tin gói dịch vụ "{data.payload.data.name}"
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPackages className="size-5" />
            Thông tin gói dịch vụ
          </CardTitle>
          <CardDescription>
            Chỉnh sửa thông tin chi tiết về gói dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Service Plan Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên gói dịch vụ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ví dụ: Basic, Professional, Enterprise"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Tên gói sẽ hiển thị trên trang chọn gói dịch vụ
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả về tính năng và lợi ích của gói dịch vụ..."
                rows={4}
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Mô tả ngắn gọn về gói dịch vụ (tối đa 1000 ký tự)
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">
                Giá <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  className="pr-16"
                  {...form.register("price", { valueAsNumber: true })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-muted-foreground">
                    VND/tháng
                  </span>
                </div>
              </div>
              {form.formState.errors.price && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.price.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Giá gói dịch vụ tính theo tháng (VND)
              </p>
            </div>

            {/* Current Plan Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-3">Thông tin hiện tại:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Giá hiện tại:</span>
                  <div className="font-medium">
                    {formatCurrency(data.payload.data.price)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <div className="font-medium">
                    {format(
                      new Date(data.payload.data.createdAt),
                      "dd/MM/yyyy",
                      {
                        locale: vi,
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={updateServicePlanMutation.isPending}
                className="flex-1"
              >
                {updateServicePlanMutation.isPending ? (
                  <>
                    <IconLoader2 className="size-4 mr-2 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật gói dịch vụ"
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/manage/service-plans">Hủy</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
