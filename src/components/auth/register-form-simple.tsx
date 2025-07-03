"use client";

import {
  IconCheck,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconMail,
  IconShield,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TypeOfVerificationCode } from "@/constants/auth.constant";
import { useRegisterMutation, useSendOTPMutation, useGoogleAuth } from "@/hooks/useAuth";
import { handleErrorApi, setSessionTokenToLocalStorage } from "@/lib/utils";
import {
  RegisterBodyType,
  SendOTPBodyType,
} from "@/schemaValidations/auth.model";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const sendOTPMutation = useSendOTPMutation();
  const { initiateGoogleLogin, isLoading: isGoogleLoading } = useGoogleAuth();

  const form = useForm<RegisterBodyType>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  const watchedEmail = form.watch("email");

  // Send OTP function
  const handleSendOTP = async () => {
    if (!watchedEmail) {
      form.setError("email", {
        type: "manual",
        message: "Vui lòng nhập email",
      });
      return;
    }

    if (sendOTPMutation.isPending || countdown > 0) return;

    try {
      const otpData: SendOTPBodyType = {
        email: watchedEmail,
        type: TypeOfVerificationCode.REGISTER,
      };

      await sendOTPMutation.mutateAsync(otpData);
      toast.success("Mã OTP đã được gửi đến email của bạn!");
      setOtpSent(true);

      // Start countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  const onSubmit = async (data: RegisterBodyType) => {
    if (registerMutation.isPending) return;

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
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Mật khẩu xác nhận không khớp",
      });
      return;
    }
    if (!data.code) {
      form.setError("code", { type: "manual", message: "Mã OTP là bắt buộc" });
      return;
    }

    try {
      const response = await registerMutation.mutateAsync(data);
      toast.success(response.payload.message || "Đăng ký thành công!");

      // Store token to localStorage (FIX: This was missing!)
      const token = response.payload.data.sessionToken;
      if (token) {
        setSessionTokenToLocalStorage(token);
      }

      // Always redirect customer to dashboard after register
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.roleName === "ADMIN_SYSTEM") {
          router.push("/manage/dashboard");
        } else {
          // Customer always goes to dashboard
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
      {/* Email Field with OTP */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="restaurant@example.com"
              className="pl-10"
              {...form.register("email")}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleSendOTP}
            disabled={
              sendOTPMutation.isPending || countdown > 0 || !watchedEmail
            }
            className="shrink-0"
          >
            {sendOTPMutation.isPending ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : countdown > 0 ? (
              countdown
            ) : (
              "Gửi OTP"
            )}
          </Button>
        </div>
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
        {otpSent && !form.formState.errors.email && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <IconCheck className="size-4" />
            <span>Mã OTP đã được gửi đến email của bạn</span>
          </div>
        )}
      </div>

      {/* OTP Field */}
      <div className="space-y-2">
        <Label htmlFor="code">Mã xác thực OTP</Label>
        <div className="relative">
          <IconShield className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="code"
            type="text"
            placeholder="Nhập mã 6 số"
            maxLength={6}
            className="pl-10"
            {...form.register("code")}
          />
        </div>
        {form.formState.errors.code && (
          <p className="text-sm text-destructive">
            {form.formState.errors.code.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Kiểm tra email và nhập mã 6 số để xác thực tài khoản
        </p>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Tối thiểu 6 ký tự"
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

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            className="pr-10"
            {...form.register("confirmPassword")}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <IconEyeOff className="size-4 text-muted-foreground" />
            ) : (
              <IconEye className="size-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-center space-x-2">
        <input
          id="terms"
          type="checkbox"
          required
          className="size-4 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
        />
        <Label
          htmlFor="terms"
          className="text-sm text-muted-foreground leading-relaxed"
        >
          Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật
        </Label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? (
          <>
            <IconLoader2 className="mr-2 size-4 animate-spin" />
            Đang tạo tài khoản...
          </>
        ) : (
          "Tạo tài khoản"
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-2 text-xs text-muted-foreground">
            Hoặc tiếp tục với
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center gap-2"
        disabled={registerMutation.isPending || isGoogleLoading}
        onClick={initiateGoogleLogin}
      >
        {isGoogleLoading ? (
          <IconLoader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4"
          >
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
        )}
        {isGoogleLoading ? "Đang kết nối..." : "Đăng ký bằng Google"}
      </Button>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      {/* Features Preview */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <p className="text-xs font-medium text-foreground mb-3">
          Khi đăng ký, bạn sẽ có:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="size-2 p-0" />
            <span>14 ngày dùng thử miễn phí</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="size-2 p-0" />
            <span>Hỗ trợ 24/7</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="size-2 p-0" />
            <span>Không cần thẻ tín dụng</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="size-2 p-0" />
            <span>Hủy bất cứ lúc nào</span>
          </div>
        </div>
      </div>
    </form>
  );
}
