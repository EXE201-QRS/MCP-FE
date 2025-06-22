"use client"

import { IconCreditCard, IconCalendar, IconTrendingUp } from "@tabler/icons-react"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function CustomerSubscriptionCard() {
  const subscription = {
    plan: "Professional",
    price: "599,000",
    nextBilling: "15/01/2025",
    daysLeft: 22,
    maxTables: 30,
    currentTables: 18,
    maxStaff: 15,
    currentStaff: 8,
  }

  const usagePercentage = {
    tables: (subscription.currentTables / subscription.maxTables) * 100,
    staff: (subscription.currentStaff / subscription.maxStaff) * 100,
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Gói dịch vụ hiện tại</CardTitle>
          <Badge variant="default">{subscription.plan}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plan Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Giá gói</span>
            <span className="font-semibold">{subscription.price}đ/tháng</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Gia hạn tiếp theo</span>
            <span className="font-semibold">{subscription.nextBilling}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Còn lại</span>
            <Badge variant="outline">{subscription.daysLeft} ngày</Badge>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Bàn đang sử dụng</span>
              <span>{subscription.currentTables}/{subscription.maxTables}</span>
            </div>
            <Progress value={usagePercentage.tables} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Nhân viên</span>
              <span>{subscription.currentStaff}/{subscription.maxStaff}</span>
            </div>
            <Progress value={usagePercentage.staff} className="h-2" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button asChild className="flex-1">
            <Link href="/customer/subscription">
              <IconTrendingUp className="mr-2 h-4 w-4" />
              Nâng cấp
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href="/customer/payments">
              <IconCreditCard className="mr-2 h-4 w-4" />
              Thanh toán
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
