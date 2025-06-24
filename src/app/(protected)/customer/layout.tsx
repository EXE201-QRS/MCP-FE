"use client"

import { AuthGuard } from "@/components/guards"
import { Role } from "@/constants/auth.constant"
import { CustomerSidebar } from "@/components/customer/customer-sidebar"
import { CustomerHeader } from "@/components/customer/customer-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole={Role.CUSTOMER}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <CustomerSidebar variant="inset" />
        <SidebarInset>
          <CustomerHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
