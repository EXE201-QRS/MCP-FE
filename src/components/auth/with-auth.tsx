"use client"

import { ComponentType } from "react"
import { AuthGuard } from "@/components/guards"
import { RoleType } from "@/constants/auth.constant"

interface WithAuthOptions {
  requiredRole?: RoleType | RoleType[]
  fallbackUrl?: string
}

/**
 * Higher-order component để wrap các page component cần authentication
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { requiredRole, fallbackUrl } = options

  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard requiredRole={requiredRole} fallbackUrl={fallbackUrl}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}

/**
 * HOC cho admin pages
 */
export function withAdminAuth<P extends object>(Component: ComponentType<P>) {
  return withAuth(Component, { requiredRole: "ADMIN_SYSTEM" })
}

/**
 * HOC cho customer pages
 */
export function withCustomerAuth<P extends object>(Component: ComponentType<P>) {
  return withAuth(Component, { requiredRole: "CUSTOMER" })
}
