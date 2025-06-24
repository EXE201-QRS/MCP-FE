import { Role, RoleType } from "@/constants/auth.constant"

/**
 * Utility functions cho authentication và authorization
 */

/**
 * Lấy route mặc định dựa trên role của user
 */
export function getDefaultRouteForRole(role: RoleType): string {
  switch (role) {
    case Role.ADMIN_SYSTEM:
      return "/manage/dashboard"
    case Role.CUSTOMER:
      return "/customer/dashboard"
    default:
      return "/login"
  }
}

/**
 * Kiểm tra xem user có quyền truy cập route không
 */
export function canAccessRoute(userRole: RoleType, pathname: string): boolean {
  // Admin routes
  if (pathname.startsWith("/manage")) {
    return userRole === Role.ADMIN_SYSTEM
  }
  
  // Customer routes
  if (pathname.startsWith("/customer")) {
    return userRole === Role.CUSTOMER
  }
  
  // Public routes
  const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/blog", "/contact", "/product"]
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))) {
    return true
  }
  
  return false
}

/**
 * Lấy redirect URL từ query params
 */
export function getRedirectUrl(): string | null {
  if (typeof window === "undefined") return null
  
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get("redirect")
}

/**
 * Redirect user dựa trên role và redirect URL
 */
export function redirectAfterAuth(role: RoleType, redirectUrl?: string | null): string {
  // Nếu có redirect URL và user có quyền truy cập
  if (redirectUrl && canAccessRoute(role, redirectUrl)) {
    return redirectUrl
  }
  
  // Nếu không có redirect hoặc không có quyền, redirect đến dashboard mặc định
  return getDefaultRouteForRole(role)
}

/**
 * Decode JWT token
 */
export function decodeJWTToken(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length === 3) {
      return JSON.parse(atob(parts[1]))
    }
  } catch (error) {
    console.error('Token decode error:', error)
  }
  return null
}

/**
 * Kiểm tra token có hợp lệ không
 */
export function isValidToken(token: string): boolean {
  const payload = decodeJWTToken(token)
  
  if (!payload || !payload.exp || !payload.roleName) {
    return false
  }
  
  // Kiểm tra token có hết hạn không
  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp > currentTime
}

/**
 * Format error message cho auth
 */
export function getAuthErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  
  return "Có lỗi xảy ra, vui lòng thử lại"
}
