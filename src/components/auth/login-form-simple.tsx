"use client";

import {
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLoginMutation } from "@/hooks/useAuth";
import { handleErrorApi } from "@/lib/utils";
import { LoginBodyType } from "@/schemaValidations/auth.model";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const form = useForm<LoginBodyType>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return;

    // Basic validation
    if (!data.email) {
      form.setError("email", { type: "manual", message: "Email là bắt buộc" });
      return;
    }
    if (!data.password) {
      form.setError("password", {
        type: "manual",
        message: "Mật khẩu là bắt buộc",
      });
      return;
    }

    try {
      const response = await loginMutation.mutateAsync(data);
      toast.success(response.payload.message || "Đăng nhập thành công!");
      
      // Redirect based on user role from response or token
      const token = response.payload.data.sessionToken;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.roleName === 'ADMIN_SYSTEM') {
          router.push("/manage/dashboard");
        } else {
          router.push("/customer/dashboard");
        }
      } catch {
        // Fallback to customer dashboard
        router.push("/customer/dashboard");
      }
      
      router.refresh();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            className="pl-10"
            {...form.register("email")}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            className="pr-10"
            {...form.register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <IconEyeOff className="size-4 text-muted-foreground" />
            ) : (
              <IconEye className="size-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            id="remember"
            type="checkbox"
            className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="remember" className="text-sm text-muted-foreground">
            Ghi nhớ đăng nhập
          </Label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Quên mật khẩu?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <>
            <IconLoader2 className="mr-2 size-4 animate-spin" />
            Đang đăng nhập...
          </>
        ) : (
          "Đăng nhập"
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-2 text-xs text-muted-foreground">
            HOẶC
          </span>
        </div>
      </div>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </form>
  );
}
