"use client"

import { useAuthStore } from "@/stores/auth.store"
import { Role, RoleType } from "@/constants/auth.constant"

/**
 * Hook để kiểm tra quyền truy cập của user
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuthStore()

  /**
   * Kiểm tra user có role cụ thể không
   */
  const hasRole = (role: RoleType): boolean => {
    if (!isAuthenticated || !user) return false
    return user.roleName === role
  }

  /**
   * Kiểm tra user có một trong các role được cho phép không
   */
  const hasAnyRole = (roles: RoleType[]): boolean => {
    if (!isAuthenticated || !user) return false
    return roles.includes(user.roleName as RoleType)
  }

  /**
   * Kiểm tra user có phải admin không
   */
  const isAdmin = (): boolean => {
    return hasRole(Role.ADMIN_SYSTEM)
  }

  /**
   * Kiểm tra user có phải customer không
   */
  const isCustomer = (): boolean => {
    return hasRole(Role.CUSTOMER)
  }

  /**
   * Kiểm tra user có thể truy cập route không
   */
  const canAccessRoute = (requiredRole?: RoleType | RoleType[]): boolean => {
    if (!isAuthenticated || !user) return false
    
    if (!requiredRole) return true

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    return hasAnyRole(roles)
  }

  /**
   * Lấy route mặc định dựa trên role của user
   */
  const getDefaultRoute = (): string => {
    if (!isAuthenticated || !user) return "/login"
    
    switch (user.roleName) {
      case Role.ADMIN_SYSTEM:
        return "/manage/dashboard"
      case Role.CUSTOMER:
        return "/customer/dashboard"
      default:
        return "/login"
    }
  }

  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isAdmin,
    isCustomer,
    canAccessRoute,
    getDefaultRoute,
  }
}
