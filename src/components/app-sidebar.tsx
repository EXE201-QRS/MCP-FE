"use client";

import {
  IconClipboardList,
  IconCreditCard,
  IconDashboard,
  IconDatabase,
  IconInnerShadowTop,
  IconPackages,
  IconReport,
  IconSearch,
  IconSettings,
  IconStar,
  IconTarget,
  IconUserCheck,
} from "@tabler/icons-react";
import * as React from "react";

import { NavClouds } from "@/components/nav-clouds";
import { NavDocuments } from "@/components/nav-documents";
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
import { useAuthStore } from "@/stores/auth.store";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/manage/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Gói dịch vụ", // Service Plans
      url: "/manage/service-plans",
      icon: IconPackages,
    },
    {
      title: "Quản lý khách hàng", // Quản lý khách hàng
      url: "/manage/customers",
      icon: IconUserCheck,
    },
  ],
  navClouds: [
    {
      title: "Quản lý đăng ký",
      icon: IconClipboardList,
      isActive: true,
      url: "/manage/subscriptions",
      items: [
        {
          title: "Danh sách đăng ký",
          url: "/manage/subscriptions",
        },
        // {
        //   title: "Đăng ký đã lưu trữ",
        //   url: "/manage/subscriptions/archived",
        // },
      ],
    },
    {
      title: "Quản lý thanh toán",
      icon: IconCreditCard,
      url: "/manage/payments",
      items: [
        {
          title: "Danh sách thanh toán",
          url: "/manage/payments",
        },
      ],
    },
    {
      title: "Quản lý QOS instances",
      icon: IconDatabase,
      url: "/manage/qos-instances",
      items: [
        {
          title: "Danh sách QOS instances",
          url: "/manage/qos-instances",
        },
        {
          title: "Tạo QOS instance",
          url: "/manage/qos-instances/create",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/manage/settings",
      icon: IconSettings,
    },
    {
      title: "Search",
      url: "/manage/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Quản lý đánh giá",
      url: "/manage/reviews",
      icon: IconStar,
    },
    {
      name: "Quản lý bài viết",
      url: "/manage/blogs",
      icon: IconReport,
    },
    {
      name: "Quản lý tài liệu", // Document Management
      url: "/manage/leads",
      icon: IconTarget,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  const defaultUser = {
    name: user?.name || "Admin User",
    email: user?.email || "admin@mcpqos.com",
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
              <Link href="/manage/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Scanorderly</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavClouds items={data.navClouds} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={defaultUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
