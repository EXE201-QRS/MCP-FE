"use client"

import { useAuthStore } from "@/stores/auth.store"
import { CustomerSidebar } from "@/components/customer/customer-sidebar"
import { CustomerHeader } from "@/components/customer/customer-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
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
  )
}
