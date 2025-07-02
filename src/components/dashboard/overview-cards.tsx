'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils'
import { DashboardOverview } from '@/apiRequests/dashboard'
import { TrendingUp, TrendingDown, Users, ShoppingCart, Server, CreditCard } from 'lucide-react'

interface OverviewCardsProps {
  data: DashboardOverview
  isLoading?: boolean
}

const OverviewCards = ({ data, isLoading }: OverviewCardsProps) => {
  const cards = [
    {
      title: 'Tổng Doanh Thu',
      value: formatCurrency(data.totalRevenue),
      change: data.revenueGrowth,
      description: 'So với kỳ trước',
      icon: CreditCard,
      color: 'text-green-600'
    },
    {
      title: 'Tổng Đơn Hàng',
      value: formatNumber(data.totalOrders),
      change: data.ordersGrowth,
      description: 'Số đơn hàng thành công',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Khách Hàng',
      value: formatNumber(data.totalCustomers),
      change: data.customersGrowth,
      description: 'Khách hàng mới',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Instances Hoạt Động',
      value: formatNumber(data.totalActiveInstances),
      change: data.instancesGrowth,
      description: 'QOS instances đang chạy',
      icon: Server,
      color: 'text-orange-600'
    },
    {
      title: 'Giá Trị Đơn Hàng TB',
      value: formatCurrency(data.averageOrderValue),
      change: data.aovGrowth,
      description: 'AOV trung bình',
      icon: TrendingUp,
      color: 'text-indigo-600'
    },
    {
      title: 'Tỷ Lệ Chuyển Đổi',
      value: formatPercentage(data.conversionRate),
      change: data.conversionGrowth,
      description: 'Conversion rate',
      icon: TrendingUp,
      color: 'text-teal-600'
    }
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted rounded mb-2"></div>
              <div className="h-3 w-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon
        const isPositive = card.change >= 0
        const TrendIcon = isPositive ? TrendingUp : TrendingDown
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{card.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendIcon 
                  className={`h-3 w-3 ${
                    isPositive ? 'text-green-500' : 'text-red-500'
                  }`} 
                />
                <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                  {formatPercentage(Math.abs(card.change))}
                </span>
                <span>{card.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default OverviewCards
