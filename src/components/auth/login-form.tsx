"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconEye, IconEyeOff, IconLoader2, IconMail } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useLoginMutation } from "@/hooks/useAuth"
import { handleErrorApi, setSessionTokenToLocalStorage } from "@/lib/utils"
import { getRedirectUrl, redirectAfterAuth } from "@/lib/auth-utils"
import { LoginBodySchema, LoginBodyType } from "@/schemaValidations/auth.model"
import { useAuthStore } from "@/stores/auth.store"
import { RoleType } from "@/constants/auth.constant"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const loginMutation = useLoginMutation()
  const { setUser, setIsAuthenticated } = useAuthStore()

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBodySchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return

    try {
      const response = await loginMutation.mutateAsync(data)
      
      // Extract data từ response
      const { sessionToken, data: userData, message } = response.payload as any
      
      if (userData && sessionToken) {
        // Lưu token vào localStorage cho client-side
        setSessionTokenToLocalStorage(sessionToken)
        
        // Update auth store
        setUser(userData)
        setIsAuthenticated(true)
        
        // Show success message
        toast.success(message || "Đăng nhập thành công!")
        
        // Small delay để đảm bảo state được update
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Get redirect URL and navigate based on role
        const redirectUrl = getRedirectUrl()
        const targetUrl = redirectAfterAuth(userData.roleName as RoleType, redirectUrl)
        
        // Force hard navigation để middleware nhận cookie
        window.location.href = targetUrl
      } else {
        throw new Error("Không thể lấy thông tin người dùng")
      }
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }

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

      {/* Demo Accounts */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground mb-2 font-medium">
          Tài khoản demo:
        </p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>
            <strong>Admin:</strong> admin@mcpqos.com / admin123
          </p>
          <p>
            <strong>Customer:</strong> customer@example.com / customer123
          </p>
        </div>
      </div>
    </form>
  )
}
