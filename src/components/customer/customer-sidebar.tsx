"use client";

import {
  IconClipboardList,
  IconCreditCard,
  IconDashboard,
  IconDatabase,
  IconHelp,
  IconInnerShadowTop,
  IconSettings,
  IconStar,
  IconTrendingUp,
  IconUser,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

const customerNavigation = {
  navMain: [
    {
      title: "Dashboard",
      url: "/customer/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Gói dịch vụ", // Subscription management
      url: "/customer/subscription",
      icon: IconClipboardList,
    },
    {
      title: "Thanh toán", // Payment history
      url: "/customer/payments",
      icon: IconCreditCard,
    },
    {
      title: "Đánh giá", // Reviews
      url: "/customer/reviews",
      icon: IconStar,
    },
    {
      title: "Thống kê", // Analytics
      url: "/customer/analytics",
      icon: IconTrendingUp,
    },
    {
      title: "Cấu hình", // Configuration
      url: "/customer/settings",
      icon: IconDatabase,
    },
  ],
  navSecondary: [
    {
      title: "Hồ sơ",
      url: "/customer/profile",
      icon: IconUser,
    },
    {
      title: "Cài đặt",
      url: "/customer/settings",
      icon: IconSettings,
    },
    {
      title: "Hỗ trợ",
      url: "/customer/support",
      icon: IconHelp,
    },
  ],
};

export function CustomerSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const defaultUser = {
    name: user?.name || "Customer User",
    email: user?.email || "customer@example.com",
    avatar: user?.avatar || "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/customer/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">QOS Portal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={customerNavigation.navMain} />
        <NavSecondary
          items={customerNavigation.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={defaultUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
