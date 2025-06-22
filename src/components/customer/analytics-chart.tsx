"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { month: "T1", orders: 186, revenue: 12.5 },
  { month: "T2", orders: 305, revenue: 18.2 },
  { month: "T3", orders: 237, revenue: 15.8 },
  { month: "T4", orders: 273, revenue: 19.4 },
  { month: "T5", orders: 209, revenue: 14.6 },
  { month: "T6", orders: 314, revenue: 22.1 },
  { month: "T7", orders: 285, revenue: 20.3 },
  { month: "T8", orders: 329, revenue: 24.5 },
  { month: "T9", orders: 278, revenue: 19.8 },
  { month: "T10", orders: 395, revenue: 28.9 },
  { month: "T11", orders: 412, revenue: 31.2 },
  { month: "T12", orders: 487, revenue: 35.6 },
]

export function CustomerAnalyticsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê năm 2024</CardTitle>
        <CardDescription>
          Đơn hàng và doanh thu theo tháng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-sm text-blue-600">
                          Đơn hàng: {payload[0]?.value}
                        </p>
                        <p className="text-sm text-green-600">
                          Doanh thu: {payload[1]?.value}M
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
