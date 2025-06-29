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
import { useGetUser, useUpdateUserMutation } from "@/hooks/useUser";
import { handleErrorApi } from "@/lib/utils";
import { UpdateUserBodyType } from "@/schemaValidations/user.model";
import { IconArrowLeft, IconLoader2, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = Number(params.id);

  const { data, isLoading, error } = useGetUser({
    id: customerId,
    enabled: !!customerId,
  });
  const updateUserMutation = useUpdateUserMutation();

  const customer = data?.payload;

  const form = useForm<UpdateUserBodyType>({
    defaultValues: {
      email: "",
      name: "",
      phoneNumber: "",
      password: "",
      roleName: Role.CUSTOMER,
    },
  });

  // Update form when customer data is loaded
  useEffect(() => {
    if (customer) {
      form.reset({
        email: customer.email,
        name: customer.name || "",
        phoneNumber: customer.phoneNumber || "",
        roleName: customer.roleName,
      });
    }
  }, [customer, form]);

  const onSubmit = async (data: UpdateUserBodyType) => {
    if (updateUserMutation.isPending) return;

    // Basic validation
    if (data.email && !data.email.trim()) {
      form.setError("email", {
        type: "manual",
        message: "Email không được để trống",
      });
      return;
    }

    if (data.name && !data.name.trim()) {
      form.setError("name", {
        type: "manual",
        message: "Tên khách hàng không được để trống",
      });
      return;
    }

    if (data.password && data.password.length < 6) {
      form.setError("password", {
        type: "manual",
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
      return;
    }

    // Validate email format if provided
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        form.setError("email", {
          type: "manual",
          message: "Định dạng email không hợp lệ",
        });
        return;
      }
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
      // Prepare payload, removing empty fields
      const payload: UpdateUserBodyType = {};
      
      if (data.email && data.email.trim() !== customer?.email) {
        payload.email = data.email.trim().toLowerCase();
      }
      
      if (data.name && data.name.trim() !== customer?.name) {
        payload.name = data.name.trim();
      }
      
      if (data.phoneNumber !== customer?.phoneNumber) {
        payload.phoneNumber = data.phoneNumber?.trim() || undefined;
      }
      
      if (data.password && data.password.trim()) {
        payload.password = data.password;
      }

      // Only update if there are changes
      if (Object.keys(payload).length === 0) {
        toast.info("Không có thay đổi nào để cập nhật");
        return;
      }

      await updateUserMutation.mutateAsync({
        id: customerId,
        ...payload,
      });
      
      toast.success("Cập nhật khách hàng thành công!");
      router.push(`/manage/customers/${customerId}`);
      router.refresh();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
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

  if (error || !customer) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-destructive mb-2">
                Không thể tải thông tin khách hàng
              </div>
              <Button asChild>
                <Link href="/manage/customers">
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
    <div className="container mx-auto py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/manage/customers/${customerId}`}>
            <IconArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Chỉnh sửa khách hàng
          </h1>
          <p className="text-muted-foreground">
            Cập nhật thông tin khách hàng: {customer.name || customer.email}
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
            Chỉnh sửa thông tin chi tiết của khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="name">Tên khách hàng</Label>
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
                Số điện thoại liên hệ (9-15 ký tự, để trống để xóa)
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu mới</Label>
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
                Để trống nếu không muốn thay đổi mật khẩu (tối thiểu 6 ký tự)
              </p>
            </div>

            {/* Role - Read only */}
            <div className="space-y-2">
              <Label htmlFor="roleName">Vai trò</Label>
              <Select
                value={customer.roleName}
                onValueChange={() => {}} // Disabled selection
                disabled
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.CUSTOMER}>Khách hàng</SelectItem>
                  <SelectItem value={Role.ADMIN_SYSTEM}>Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Vai trò không thể thay đổi từ trang này
              </p>
            </div>

            {/* Customer Info */}
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Thông tin bổ sung:</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• ID khách hàng: {customer.id}</div>
                <div>• Ngày tạo: {new Date(customer.createdAt).toLocaleDateString("vi-VN")}</div>
                <div>• Cập nhật lần cuối: {new Date(customer.updatedAt).toLocaleDateString("vi-VN")}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="flex-1"
              >
                {updateUserMutation.isPending ? (
                  <>
                    <IconLoader2 className="size-4 mr-2 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật khách hàng"
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/manage/customers/${customerId}`}>Hủy</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
