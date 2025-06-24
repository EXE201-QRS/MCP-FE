"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"
import { Role, RoleType } from "@/constants/auth.constant"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: RoleType | RoleType[]
  fallbackUrl?: string
}

export function AuthGuard({ 
  children, 
  requiredRole, 
  fallbackUrl = "/login" 
}: AuthGuardProps) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    // Nếu đang loading thì chờ
    if (isLoading) return

    // Nếu chưa đăng nhập
    if (!isAuthenticated || !user) {
      router.replace(fallbackUrl)
      return
    }

    // Nếu có yêu cầu role cụ thể
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      const hasRequiredRole = roles.includes(user.roleName as RoleType)
      
      if (!hasRequiredRole) {
        // Redirect dựa trên role của user
        const redirectUrl = user.roleName === Role.ADMIN_SYSTEM 
          ? "/manage/dashboard" 
          : "/customer/dashboard"
        router.replace(redirectUrl)
        return
      }
    }
  }, [user, isAuthenticated, isLoading, requiredRole, router, fallbackUrl])

  // Hiển thị loading khi đang kiểm tra auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Kiểm tra đăng nhập...</p>
        </div>
      </div>
    )
  }

  // Nếu chưa đăng nhập hoặc không có quyền, không render gì
  if (!isAuthenticated || !user) {
    return null
  }

  // Nếu có yêu cầu role và user không có quyền
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    const hasRequiredRole = roles.includes(user.roleName as RoleType)
    
    if (!hasRequiredRole) {
      return null
    }
  }

  return <>{children}</>
}
