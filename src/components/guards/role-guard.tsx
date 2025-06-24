"use client"

import { useAuthStore } from "@/stores/auth.store"
import { Role, RoleType } from "@/constants/auth.constant"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: RoleType[]
  fallback?: React.ReactNode
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuthStore()

  // Nếu chưa đăng nhập hoặc không có user
  if (!isAuthenticated || !user) {
    return <>{fallback}</>
  }

  // Kiểm tra role
  const hasPermission = allowedRoles.includes(user.roleName as RoleType)

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Component helpers cho từng role cụ thể
export function AdminOnlyGuard({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN_SYSTEM]} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function CustomerOnlyGuard({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <RoleGuard allowedRoles={[Role.CUSTOMER]} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}
