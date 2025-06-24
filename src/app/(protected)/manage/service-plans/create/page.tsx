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
import { useAddServicePlanMutation } from "@/hooks/useServicePlan";
import { handleErrorApi } from "@/lib/utils";
import { CreateServicePlanBodyType } from "@/schemaValidations/service-plan.model";
import { IconArrowLeft, IconLoader2, IconPackages } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateServicePlanPage() {
  const router = useRouter();
  const addServicePlanMutation = useAddServicePlanMutation();

  const form = useForm<CreateServicePlanBodyType>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  const onSubmit = async (data: CreateServicePlanBodyType) => {
    if (addServicePlanMutation.isPending) return;

    // Basic validation
    if (!data.name.trim()) {
      form.setError("name", {
        type: "manual",
        message: "Tên gói dịch vụ là bắt buộc",
      });
      return;
    }

    if (data.price < 0) {
      form.setError("price", {
        type: "manual",
        message: "Giá phải lớn hơn hoặc bằng 0",
      });
      return;
    }

    try {
      const payload = {
        ...data,
        description: data.description?.trim() || null,
      };

      await addServicePlanMutation.mutateAsync(payload);
      toast.success("Tạo gói dịch vụ thành công!");
      router.push("/manage/service-plans");
      router.refresh();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

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
            Thêm gói dịch vụ mới
          </h1>
          <p className="text-muted-foreground">
            Tạo gói dịch vụ QR Ordering System cho khách hàng
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
            Điền thông tin chi tiết về gói dịch vụ mới
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

            {/* Pricing Examples */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-3">Gợi ý giá tham khảo:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-medium">Basic</div>
                  <div className="text-muted-foreground">199,000 VND/tháng</div>
                  <div className="text-muted-foreground">Phù hợp quán nhỏ</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">Professional</div>
                  <div className="text-muted-foreground">399,000 VND/tháng</div>
                  <div className="text-muted-foreground">Cho nhà hàng vừa</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">Enterprise</div>
                  <div className="text-muted-foreground">799,000 VND/tháng</div>
                  <div className="text-muted-foreground">Chuỗi nhà hàng</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={addServicePlanMutation.isPending}
                className="flex-1"
              >
                {addServicePlanMutation.isPending ? (
                  <>
                    <IconLoader2 className="size-4 mr-2 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo gói dịch vụ"
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
