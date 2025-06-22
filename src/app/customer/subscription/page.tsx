"use client"

import { IconCheck, IconStar, IconCreditCard } from "@tabler/icons-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const plans = [
  {
    name: "Basic",
    price: "299,000",
    duration: "tháng",
    description: "Phù hợp cho nhà hàng nhỏ, quán ăn gia đình",
    current: false,
    features: [
      "Tối đa 10 bàn",
      "5 nhân viên sử dụng",
      "Dashboard cơ bản",
      "Thanh toán online",
      "Hỗ trợ email",
      "Backup hàng ngày",
    ],
  },
  {
    name: "Professional", 
    price: "599,000",
    duration: "tháng",
    description: "Dành cho nhà hàng vừa, chuỗi nhỏ",
    current: true,
    features: [
      "Tối đa 30 bàn", 
      "15 nhân viên sử dụng",
      "Dashboard nâng cao",
      "Analytics chi tiết",
      "Custom branding",
      "Thanh toán online",
      "Hỗ trợ ưu tiên",
      "Backup real-time",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    price: "1,299,000", 
    duration: "tháng",
    description: "Cho chuỗi nhà hàng lớn, enterprise",
    current: false,
    features: [
      "Không giới hạn bàn",
      "Không giới hạn nhân viên", 
      "Dashboard enterprise",
      "Advanced analytics",
      "White-label solution",
      "Multi-location support",
      "Dedicated support",
      "Custom integrations",
      "SLA đảm bảo",
    ],
  },
]

const currentUsage = {
  tables: { current: 18, max: 30, percentage: 60 },
  staff: { current: 8, max: 15, percentage: 53 },
  orders: { current: 2847, max: "Unlimited" },
  storage: { current: 1.2, max: 5, percentage: 24, unit: "GB" },
}

export default function CustomerSubscriptionPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý gói dịch vụ</h1>
        <p className="text-muted-foreground">
          Quản lý và nâng cấp gói dịch vụ QOS của bạn
        </p>
      </div>

      {/* Current Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Mức sử dụng hiện tại</CardTitle>
          <CardDescription>
            Gói Professional - Gia hạn vào 15/01/2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Bàn</span>
                <span>{currentUsage.tables.current}/{currentUsage.tables.max}</span>
              </div>
              <Progress value={currentUsage.tables.percentage} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nhân viên</span>
                <span>{currentUsage.staff.current}/{currentUsage.staff.max}</span>
              </div>
              <Progress value={currentUsage.staff.percentage} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Đơn hàng tháng này</span>
                <span>{currentUsage.orders.current}</span>
              </div>
              <Progress value={85} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Lưu trữ</span>
                <span>{currentUsage.storage.current}/{currentUsage.storage.max} {currentUsage.storage.unit}</span>
              </div>
              <Progress value={currentUsage.storage.percentage} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative ${
              plan.current 
                ? "border-primary ring-2 ring-primary/10 shadow-lg" 
                : "border-border/50"
            }`}
          >
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <IconStar className="mr-1 size-3" />
                  Gói hiện tại
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm">
                {plan.description}
              </CardDescription>
              <div className="mt-4">
                <div className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-lg font-normal text-muted-foreground">
                    đ/{plan.duration}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium">Tính năng bao gồm:</p>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <IconCheck className="size-4 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                className="w-full" 
                variant={plan.current ? "outline" : "default"}
                disabled={plan.current}
              >
                {plan.current ? (
                  "Gói hiện tại"
                ) : (
                  <>
                    <IconCreditCard className="mr-2 size-4" />
                    {plan.name === "Basic" ? "Hạ cấp" : "Nâng cấp"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Billing Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Phương thức thanh toán</h4>
              <div className="flex items-center space-x-2">
                <IconCreditCard className="h-4 w-4" />
                <span className="text-sm">**** **** **** 1234</span>
                <Badge variant="outline">Visa</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Chu kỳ thanh toán</h4>
              <p className="text-sm text-muted-foreground">
                Thanh toán hàng tháng vào ngày 15
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/customer/payments">
                Xem lịch sử thanh toán
              </Link>
            </Button>
            <Button variant="outline">
              Cập nhật phương thức thanh toán
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
