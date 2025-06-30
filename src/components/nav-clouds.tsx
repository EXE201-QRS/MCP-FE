"use client";

import {
  IconChevronRight,
  IconDots,
  IconFolder,
  IconFolderOpen,
  IconPlus,
  type Icon,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavClouds({
  title,
  items,
}: {
  title?: string;
  items: {
    title: string;
    url: string;
    icon?: Icon;
    isActive?: boolean;
    badge?: string | number;
    items?: {
      title: string;
      url: string;
      badge?: string | number;
    }[];
  }[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      {title && (
        <SidebarGroupLabel className="flex items-center justify-between">
          {title}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction showOnHover>
                <IconPlus className="size-4" />
                <span className="sr-only">Add item</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 rounded-lg"
              side="right"
              align="start"
            >
              <DropdownMenuItem>
                <IconFolder className="size-4 mr-2" />
                <span>New Folder</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlus className="size-4 mr-2" />
                <span>New Item</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconDots className="size-4 mr-2" />
                <span>More options</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const [isOpen, setIsOpen] = useState(item.isActive || false);
            const IconComponent =
              item.icon || (isOpen ? IconFolderOpen : IconFolder);

            return (
              <Collapsible
                key={item.title}
                asChild
                open={isOpen}
                onOpenChange={setIsOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <IconComponent className="size-4" />
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="h-5 px-1.5 text-xs font-medium ml-auto mr-1"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.items && item.items.length > 0 && (
                        <IconChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {/* Dropdown Menu for Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <IconDots className="size-4" />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side="right"
                      align="start"
                    >
                      <DropdownMenuItem asChild>
                        <Link href={item.url}>
                          <span>Open</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span>Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Sub Items */}
                  {item.items && item.items.length > 0 && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={subItem.url}
                                className="flex items-center justify-between"
                              >
                                <span className="truncate">
                                  {subItem.title}
                                </span>
                                {subItem.badge && (
                                  <Badge
                                    variant="outline"
                                    className="h-4 px-1 text-xs ml-2"
                                  >
                                    {subItem.badge}
                                  </Badge>
                                )}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
