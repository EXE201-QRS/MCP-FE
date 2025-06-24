"use client"

import { Badge } from "@/components/ui/badge"
import { usePermissions } from "@/hooks/usePermissions"
import { Role } from "@/constants/auth.constant"

export function UserRoleBadge() {
  const { user, isAdmin, isCustomer } = usePermissions()

  if (!user) return null

  const getRoleConfig = () => {
    if (isAdmin()) {
      return {
        label: "Quản trị viên",
        variant: "destructive" as const,
        description: "Toàn quyền hệ thống"
      }
    }
    
    if (isCustomer()) {
      return {
        label: "Khách hàng",
        variant: "secondary" as const,
        description: "Người dùng dịch vụ"
      }
    }

    return {
      label: "Không xác định",
      variant: "outline" as const,
      description: ""
    }
  }

  const roleConfig = getRoleConfig()

  return (
    <div className="flex items-center gap-2">
      <Badge variant={roleConfig.variant} className="text-xs">
        {roleConfig.label}
      </Badge>
      {roleConfig.description && (
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {roleConfig.description}
        </span>
      )}
    </div>
  )
}
