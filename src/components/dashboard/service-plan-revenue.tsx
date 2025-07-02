'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ServicePlanRevenue } from '@/apiRequests/dashboard'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

interface ServicePlanRevenueProps {
  data: ServicePlanRevenue[]
  isLoading?: boolean
  chartType?: 'pie' | 'bar'
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

const ServicePlanRevenueChart = ({ 
  data, 
  isLoading, 
  chartType = 'pie' 
}: ServicePlanRevenueProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doanh Thu Theo Gói Dịch Vụ</CardTitle>
          <CardDescription>Phân tích doanh thu từng service plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium mb-2">{data.servicePlanName}</p>
          <p className="text-sm">Doanh thu: {formatCurrency(data.revenue)}</p>
          <p className="text-sm">Đơn hàng: {data.orders}</p>
          <p className="text-sm">Tỷ lệ: {formatPercentage(data.percentage)}</p>
        </div>
      )
    }
    return null
  }

  const renderPieChart = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="revenue"
              label={({ name, percentage }) => `${name}: ${formatPercentage(percentage)}`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Service Plan List */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground">
          Chi Tiết Theo Gói Dịch Vụ
        </h4>
        {data.map((plan, index) => {
          const isPositiveGrowth = plan.growth >= 0
          const TrendIcon = isPositiveGrowth ? TrendingUp : TrendingDown
          
          return (
            <div 
              key={plan.servicePlanId}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div>
                  <p className="font-medium text-sm">{plan.servicePlanName}</p>
                  <p className="text-xs text-muted-foreground">
                    {plan.orders} đơn hàng
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">
                  {formatCurrency(plan.revenue)}
                </p>
                <div className="flex items-center space-x-1 text-xs">
                  <TrendIcon 
                    className={`h-3 w-3 ${
                      isPositiveGrowth ? 'text-green-500' : 'text-red-500'
                    }`}
                  />
                  <span className={
                    isPositiveGrowth ? 'text-green-500' : 'text-red-500'
                  }>
                    {formatPercentage(Math.abs(plan.growth))}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderBarChart = () => (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="servicePlanName"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="revenue"
            fill="hsl(var(--chart-1))"
            name="Doanh thu"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh Thu Theo Gói Dịch Vụ</CardTitle>
        <CardDescription>
          Phân tích hiệu suất doanh thu từng service plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartType === 'pie' ? renderPieChart() : renderBarChart()}
      </CardContent>
    </Card>
  )
}

export default ServicePlanRevenueChart
