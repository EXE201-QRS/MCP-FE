"use client";

import { Settings } from "lucide-react";
import { ChangePasswordForm } from "./change-password-form";
import { ChangeProfileForm } from "./change-profile-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface SettingsPageContentProps {
  title?: string;
  description?: string;
}

export function SettingsPageContent({ 
  title = "Cài đặt", 
  description = "Quản lý thông tin cá nhân và cài đặt tài khoản"
}: SettingsPageContentProps) {
  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ChangeProfileForm />
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}