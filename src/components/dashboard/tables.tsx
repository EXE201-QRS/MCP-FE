'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TopCustomer, RecentTransaction } from '@/apiRequests/dashboard'
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, Calendar, CreditCard } from 'lucide-react'

interface TopCustomersProps {
  data: TopCustomer[]
  isLoading?: boolean
}

interface RecentTransactionsProps {
  data: RecentTransaction[]
  isLoading?: boolean
}

export const TopCustomersTable = ({ data, isLoading }: TopCustomersProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Khách Hàng</CardTitle>
          <CardDescription>Khách hàng có doanh thu cao nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-3 w-24 bg-muted rounded"></div>
                </div>
                <div className="h-4 w-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getInitials = (name: string) => {
    if (!name || name === 'N/A') return 'NA'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Khách Hàng</CardTitle>
        <CardDescription>
          Khách hàng có doanh thu cao nhất trong kỳ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((customer, index) => (
            <div 
              key={customer.userId}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {getInitials(customer.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {customer.userName || 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {customer.email}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <CreditCard className="h-3 w-3" />
                      <span>{customer.totalOrders} đơn</span>
                    </div>
                    {customer.lastOrderDate && (
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(customer.lastOrderDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">
                  {formatCurrency(customer.totalRevenue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  TB: {formatCurrency(customer.totalRevenue / customer.totalOrders)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export const RecentTransactionsTable = ({ data, isLoading }: RecentTransactionsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Giao Dịch Gần Đây</CardTitle>
          <CardDescription>Các giao dịch thanh toán mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-3 w-24 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded"></div>
                  <div className="h-3 w-16 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'PAID': { label: 'Đã thanh toán', variant: 'default' as const },
      'PENDING': { label: 'Đang xử lý', variant: 'secondary' as const },
      'FAILED': { label: 'Thất bại', variant: 'destructive' as const },
      'CANCELLED': { label: 'Đã hủy', variant: 'outline' as const }
    }
    
    const config = statusMap[status as keyof typeof statusMap] || { 
      label: status, 
      variant: 'outline' as const 
    }
    
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    )
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Giao Dịch Gần Đây</CardTitle>
        <CardDescription>
          Các giao dịch thanh toán mới nhất trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((transaction) => (
            <div 
              key={transaction.paymentId}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {getInitials(transaction.customerName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {transaction.customerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.servicePlanName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: #{transaction.paymentId}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold text-sm">
                  {formatCurrency(transaction.amount)}
                </p>
                {getStatusBadge(transaction.status)}
                <p className="text-xs text-muted-foreground">
                  {formatDate(transaction.paidAt, 'datetime')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
