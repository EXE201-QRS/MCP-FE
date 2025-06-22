"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconCheck,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconMail,
  IconShield,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypeOfVerificationCode } from "@/constants/auth.constant";
import { useForgotPasswordMutation, useSendOTPMutation } from "@/hooks/useAuth";
import { handleErrorApi } from "@/lib/utils";
import {
  ForgotPasswordBodySchema,
  ForgotPasswordBodyType,
  SendOTPBodyType,
} from "@/schemaValidations/auth.model";

export function ForgotPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const router = useRouter();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const sendOTPMutation = useSendOTPMutation();

  const form = useForm<ForgotPasswordBodyType>({
    resolver: zodResolver(ForgotPasswordBodySchema),
    defaultValues: {
      email: "",
      code: "",
      newPassword: "",
      confirmNewPassword: "",
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
        type: TypeOfVerificationCode.FORGOT_PASSWORD,
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

  const onSubmit = async (data: ForgotPasswordBodyType) => {
    if (forgotPasswordMutation.isPending) return;

    try {
      const response = await forgotPasswordMutation.mutateAsync(data);
      toast.success("Đặt lại mật khẩu thành công!");
      router.push("/login");
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
              placeholder="Nhập email đã đăng ký"
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
      </div>

      {/* New Password Field */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">Mật khẩu mới</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Tối thiểu 6 ký tự"
            className="pr-10"
            {...form.register("newPassword")}
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
        {form.formState.errors.newPassword && (
          <p className="text-sm text-destructive">
            {form.formState.errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm New Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</Label>
        <div className="relative">
          <Input
            id="confirmNewPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới"
            className="pr-10"
            {...form.register("confirmNewPassword")}
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
        {form.formState.errors.confirmNewPassword && (
          <p className="text-sm text-destructive">
            {form.formState.errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={forgotPasswordMutation.isPending}
      >
        {forgotPasswordMutation.isPending ? (
          <>
            <IconLoader2 className="mr-2 size-4 animate-spin" />
            Đang đặt lại mật khẩu...
          </>
        ) : (
          "Đặt lại mật khẩu"
        )}
      </Button>
    </form>
  );
}
