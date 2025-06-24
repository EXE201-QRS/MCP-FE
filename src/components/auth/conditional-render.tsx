"use client"

import { cn } from "@/lib/utils"
import { usePermissions } from "@/hooks/usePermissions"
import { RoleType } from "@/constants/auth.constant"

interface ConditionalRenderProps {
  children: React.ReactNode
  showFor?: RoleType | RoleType[]
  hideFor?: RoleType | RoleType[]
  requireAuth?: boolean
  fallback?: React.ReactNode
  className?: string
}

/**
 * Component để render có điều kiện dựa trên role của user
 */
export function ConditionalRender({
  children,
  showFor,
  hideFor,
  requireAuth = true,
  fallback = null,
  className,
}: ConditionalRenderProps) {
  const { isAuthenticated, hasRole, hasAnyRole } = usePermissions()

  // Nếu yêu cầu auth nhưng user chưa đăng nhập
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>
  }

  // Nếu có hideFor và user có role đó
  if (hideFor) {
    const hiddenRoles = Array.isArray(hideFor) ? hideFor : [hideFor]
    if (hasAnyRole(hiddenRoles)) {
      return <>{fallback}</>
    }
  }

  // Nếu có showFor và user không có role đó
  if (showFor) {
    const allowedRoles = Array.isArray(showFor) ? showFor : [showFor]
    if (!hasAnyRole(allowedRoles)) {
      return <>{fallback}</>
    }
  }

  return (
    <div className={cn(className)}>
      {children}
    </div>
  )
}

// Helper components
export function AdminOnly({ 
  children, 
  fallback = null, 
  className 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string 
}) {
  return (
    <ConditionalRender 
      showFor="ADMIN_SYSTEM" 
      fallback={fallback}
      className={className}
    >
      {children}
    </ConditionalRender>
  )
}

export function CustomerOnly({ 
  children, 
  fallback = null, 
  className 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string 
}) {
  return (
    <ConditionalRender 
      showFor="CUSTOMER" 
      fallback={fallback}
      className={className}
    >
      {children}
    </ConditionalRender>
  )
}

export function AuthenticatedOnly({ 
  children, 
  fallback = null, 
  className 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string 
}) {
  return (
    <ConditionalRender 
      requireAuth={true}
      fallback={fallback}
      className={className}
    >
      {children}
    </ConditionalRender>
  )
}

export function GuestOnly({ 
  children, 
  fallback = null, 
  className 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string 
}) {
  return (
    <ConditionalRender 
      requireAuth={false}
      fallback={fallback}
      className={className}
    >
      {children}
    </ConditionalRender>
  )
}
