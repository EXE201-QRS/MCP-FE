"use client";

import {
  IconCamera,
  IconClipboardList,
  IconCreditCard,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileText,
  IconFileWord,
  IconHelp,
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
      title: "Quản lý đăng ký", // Subscriptions Management
      url: "/manage/subscriptions",
      icon: IconClipboardList,
    },
    {
      title: "Quản lý thanh toán", // Payments Management
      url: "/manage/payments",
      icon: IconCreditCard,
    },
    {
      title: "Quản lý khách hàng", // Quản lý khách hàng
      url: "/manage/customers",
      icon: IconUserCheck,
    },
    {
      title: "Quản lý QOS instances", // Quản lý QOS instances
      url: "/manage/qos-instances",
      icon: IconDatabase,
    },
    {
      title: "Quản lý reviews", // Quản lý reviews
      url: "/manage/reviews",
      icon: IconStar,
    },

    {
      title: "Quản lý blog", // Quản lý blog
      url: "/manage/blog",
      icon: IconFileText,
    },
    {
      title: "Leads", // Quản lý leads
      url: "/manage/leads",
      icon: IconTarget,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
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
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={defaultUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
