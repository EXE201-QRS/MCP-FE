'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomerSegment, GeographicRevenue } from '@/apiRequests/dashboard'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface CustomerSegmentsProps {
  data: CustomerSegment[]
  isLoading?: boolean
}

interface GeographicRevenueProps {
  data: GeographicRevenue[]
  isLoading?: boolean
}

const SEGMENT_COLORS = {
  'High Value': 'hsl(var(--chart-1))',
  'Medium Value': 'hsl(var(--chart-2))',
  'Low Value': 'hsl(var(--chart-3))',
  'Inactive': 'hsl(var(--chart-4))'
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export const CustomerSegmentsChart = ({ data, isLoading }: CustomerSegmentsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Phân Khúc Khách Hàng</CardTitle>
          <CardDescription>Phân tích khách hàng theo giá trị chi tiêu</CardDescription>
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
          <p className="font-medium mb-2">{data.segment}</p>
          <p className="text-sm">Số lượng: {formatNumber(data.count)}</p>
          <p className="text-sm">Doanh thu: {formatCurrency(data.revenue)}</p>
          <p className="text-sm">Giá trị TB: {formatCurrency(data.averageValue)}</p>
          <p className="text-sm">Tỷ lệ: {formatPercentage(data.percentage)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân Khúc Khách Hàng</CardTitle>
        <CardDescription>
          Phân tích khách hàng theo giá trị chi tiêu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="segment"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Segment Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground">
              Chi Tiết Phân Khúc
            </h4>
            {data.map((segment, index) => (
              <div 
                key={segment.segment}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: SEGMENT_COLORS[segment.segment as keyof typeof SEGMENT_COLORS] || COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <p className="font-medium text-sm">{segment.segment}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(segment.count)} khách hàng
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {formatCurrency(segment.revenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    TB: {formatCurrency(segment.averageValue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const GeographicRevenueChart = ({ data, isLoading }: GeographicRevenueProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doanh Thu Theo Khu Vực</CardTitle>
          <CardDescription>Phân bố doanh thu theo địa lý</CardDescription>
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
          <p className="font-medium mb-2">{data.region}</p>
          <p className="text-sm">Doanh thu: {formatCurrency(data.revenue)}</p>
          <p className="text-sm">Đơn hàng: {formatNumber(data.orders)}</p>
          <p className="text-sm">Tỷ lệ: {formatPercentage(data.percentage)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh Thu Theo Khu Vực</CardTitle>
        <CardDescription>
          Phân bố doanh thu theo địa lý
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                  label={({ region, percentage }) => `${region}: ${formatPercentage(percentage)}`}
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

          {/* Region Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground">
              Chi Tiết Theo Khu Vực
            </h4>
            {data.map((region, index) => (
              <div 
                key={region.region}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <p className="font-medium text-sm">{region.region}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(region.orders)} đơn hàng
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {formatCurrency(region.revenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPercentage(region.percentage)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
