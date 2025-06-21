"use client"

import * as React from "react"
import Link from "next/link"
import { IconCopy, IconExternalLink, IconUser, IconLock, IconDeviceDesktop, IconDeviceMobile } from "@tabler/icons-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

const demoAccounts = [
  {
    role: "Admin",
    email: "admin-demo@gmail.com",
    password: "123456",
    description: "Toàn quyền quản lý hệ thống",
    icon: IconUser,
    color: "bg-red-500",
  },
  {
    role: "Staff",
    email: "staff-demo@gmail.com",
    password: "123456",
    description: "Nhân viên phục vụ, quản lý đơn hàng",
    icon: IconUser,
    color: "bg-blue-500",
  },
  {
    role: "Chef",
    email: "chef-demo@gmail.com",
    password: "123456",
    description: "Đầu bếp, quản lý món ăn",
    icon: IconUser,
    color: "bg-green-500",
  },
]

const demoUrls = [
  {
    title: "Dashboard Quản lý",
    url: "https://demo.scanorderly.com",
    description: "Giao diện quản lý dành cho Admin, Staff, Chef",
    icon: IconDeviceDesktop,
    type: "admin",
  },
  {
    title: "Giao diện Gọi món",
    url: "https://demo.scanorderly.com/tables/1?token=table_1750517462872_f25nme3tvwp",
    description: "Trải nghiệm đặt món như khách hàng",
    icon: IconDeviceMobile,
    type: "customer",
  },
]

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text)
  toast.success(`Đã copy ${label}!`)
}

interface DemoDialogProps {
  children: React.ReactNode
}

export function DemoDialog({ children }: DemoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <IconExternalLink className="size-6" />
            Demo QR Ordering System
          </DialogTitle>
          <DialogDescription className="text-base">
            Trải nghiệm đầy đủ hệ thống QOS với tài khoản demo và giao diện thực tế
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Demo URLs */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <IconExternalLink className="size-5" />
              Trải nghiệm Demo
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {demoUrls.map((demo) => {
                const IconComponent = demo.icon
                return (
                  <Card key={demo.title} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${
                          demo.type === 'admin' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 
                          'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400'
                        }`}>
                          <IconComponent className="size-4" />
                        </div>
                        {demo.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {demo.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button asChild className="flex-1" size="sm">
                          <Link href={demo.url} target="_blank">
                            <IconExternalLink className="mr-2 size-4" />
                            Mở Demo
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(demo.url, "link")}
                        >
                          <IconCopy className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Demo Accounts */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <IconLock className="size-5" />
              Tài khoản Demo
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {demoAccounts.map((account) => {
                const IconComponent = account.icon
                return (
                  <Card key={account.role} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className={`p-2 rounded-lg text-white ${account.color}`}>
                          <IconComponent className="size-4" />
                        </div>
                        {account.role}
                        <Badge variant="secondary" className="ml-auto text-xs">
                          Demo
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {account.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          Email:
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-2 py-1 bg-muted rounded text-xs font-mono">
                            {account.email}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(account.email, "email")}
                          >
                            <IconCopy className="size-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Password */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          Password:
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-2 py-1 bg-muted rounded text-xs font-mono">
                            {account.password}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(account.password, "password")}
                          >
                            <IconCopy className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Instructions */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium mb-2">📝 Hướng dẫn sử dụng Demo:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Dashboard:</strong> Đăng nhập bằng một trong các tài khoản demo ở trên</li>
              <li>• <strong>Giao diện Gọi món:</strong> Trải nghiệm trực tiếp như khách hàng, không cần đăng nhập</li>
              <li>• <strong>Dữ liệu:</strong> Tất cả dữ liệu demo được reset định kỳ</li>
              <li>• <strong>Tính năng:</strong> Có thể test đầy đủ các chức năng của hệ thống</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Ấn tượng với demo? Hãy bắt đầu sử dụng ngay!
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/register">
                  Đăng ký miễn phí
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="#contact">
                  Liên hệ tư vấn
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
