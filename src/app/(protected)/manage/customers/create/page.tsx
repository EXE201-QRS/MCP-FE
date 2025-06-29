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
import { Role } from "@/constants/auth.constant";
import { useAddUserMutation } from "@/hooks/useUser";
import { handleErrorApi } from "@/lib/utils";
import { CreateUserBodyType } from "@/schemaValidations/user.model";
import { IconArrowLeft, IconLoader2, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateCustomerPage() {
  const router = useRouter();
  const addUserMutation = useAddUserMutation();

  const form = useForm<CreateUserBodyType>({
    defaultValues: {
      email: "",
      name: "",
      phoneNumber: "",
      password: "",
      roleName: Role.CUSTOMER,
    },
  });

  const onSubmit = async (data: CreateUserBodyType) => {
    if (addUserMutation.isPending) return;

    // Basic validation
    if (!data.email.trim()) {
      form.setError("email", {
        type: "manual",
        message: "Email là bắt buộc",
      });
      return;
    }

    if (!data.name.trim()) {
      form.setError("name", {
        type: "manual",
        message: "Tên khách hàng là bắt buộc",
      });
      return;
    }

    if (!data.password || data.password.length < 6) {
      form.setError("password", {
        type: "manual",
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      form.setError("email", {
        type: "manual",
        message: "Định dạng email không hợp lệ",
      });
      return;
    }

    // Validate phone number if provided
    if (data.phoneNumber && data.phoneNumber.length < 9) {
      form.setError("phoneNumber", {
        type: "manual",
        message: "Số điện thoại phải có ít nhất 9 ký tự",
      });
      return;
    }

    try {
      const payload = {
        ...data,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phoneNumber: data.phoneNumber?.trim() || undefined,
        roleName: Role.CUSTOMER, // Ensure customer role
      };

      await addUserMutation.mutateAsync(payload);
      toast.success("Tạo khách hàng thành công!");
      router.push("/manage/customers");
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
          <Link href="/manage/customers">
            <IconArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Thêm khách hàng mới
          </h1>
          <p className="text-muted-foreground">
            Tạo tài khoản khách hàng mới trong hệ thống
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUser className="size-5" />
            Thông tin khách hàng
          </CardTitle>
          <CardDescription>
            Điền thông tin chi tiết về khách hàng mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Email sẽ được sử dụng để đăng nhập vào hệ thống
              </p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên khách hàng <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nguyễn Văn A"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Tên đầy đủ của khách hàng (tối đa 100 ký tự)
              </p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="0901234567"
                {...form.register("phoneNumber")}
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phoneNumber.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Số điện thoại liên hệ (9-15 ký tự)
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Mật khẩu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Mật khẩu đăng nhập (tối thiểu 6 ký tự)
              </p>
            </div>

            {/* Role - Hidden but set to CUSTOMER */}
            <div className="space-y-2">
              <Label htmlFor="roleName">Vai trò</Label>
              <Select
                value={Role.CUSTOMER}
                onValueChange={() => {}} // Disabled selection
                disabled
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.CUSTOMER}>Khách hàng</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Vai trò được cố định là khách hàng
              </p>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Lưu ý bảo mật:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Mật khẩu sẽ được mã hóa tự động trong hệ thống</li>
                <li>• Khuyến nghị sử dụng mật khẩu mạnh (có chữ hoa, số, ký tự đặc biệt)</li>
                <li>• Khách hàng có thể thay đổi mật khẩu sau khi đăng nhập</li>
                <li>• Email phải là duy nhất trong hệ thống</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={addUserMutation.isPending}
                className="flex-1"
              >
                {addUserMutation.isPending ? (
                  <>
                    <IconLoader2 className="size-4 mr-2 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo khách hàng"
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/manage/customers">Hủy</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
