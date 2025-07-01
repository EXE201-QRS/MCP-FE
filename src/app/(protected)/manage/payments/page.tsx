"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAdminSubscriptionList } from "@/hooks/useSubscription";
import {
  IconCreditCard,
  IconSearch,
  IconTrendingUp,
  IconFilter,
  IconRefresh,
  IconDownload,
  IconEye,
  IconCalendar,
  IconBuildingStore,
  IconUser,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const getPaymentStatusBadge = (status: string) => {
  const statusConfig = {
    PENDING: { 
      label: "Chờ thanh toán", 
      variant: "secondary" as const,
      className: "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400"
    },
    PAID: { 
      label: "Đã thanh toán", 
      variant: "default" as const,
      className: "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400"
    },
    ACTIVE: { 
      label: "Đang hoạt động", 
      variant: "default" as const,
      className: "bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400"
    },
    FAILED: { 
      label: "Thất bại", 
      variant: "destructive" as const,
      className: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400"
    },
    CANCELLED: { 
      label: "Đã hủy", 
      variant: "destructive" as const,
      className: "bg-gray-500/10 text-gray-700 border-gray-200 dark:text-gray-400"
    },
    EXPIRED: { 
      label: "Hết hạn", 
      variant: "destructive" as const,
      className: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400"
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    variant: "secondary" as const,
    className: ""
  };

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export default function AdminPaymentsPage() {
  const searchParams = useSearchParams();
  const subscriptionIdFilter = searchParams.get('subscriptionId');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: subscriptionsData, isLoading, refetch, isFetching } = useGetAdminSubscriptionList({
    page: 1,
    limit: 100, // Get more data for payment analysis
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Transform subscriptions into payment transactions
  const paymentTransactions = useMemo(() => {
    if (!subscriptionsData?.payload?.data) return [];
    
    return subscriptionsData.payload.data.map((subscription) => ({
      id: `PAY-${subscription.id}`,
      subscriptionId: subscription.id,
      orderId: `ORD-${subscription.id}-${Date.now()}`,
      customerName: subscription.user?.name || 'N/A',
      customerEmail: subscription.user?.email || 'N/A',
      restaurantName: subscription.restaurantName,
      servicePlanName: subscription.servicePlan?.name || 'N/A',
      amount: subscription.servicePlan?.price || 0,
      status: subscription.status,
      paymentMethod: 'PayOS',
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
      subscription: subscription,
    }));
  }, [subscriptionsData]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return paymentTransactions.filter((transaction) => {
      // Subscription ID filter (from URL params)
      if (subscriptionIdFilter && transaction.subscriptionId.toString() !== subscriptionIdFilter) {
        return false;
      }

      // Search filter
      const matchesSearch = 
        transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.servicePlanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
      
      // Date filter
      let matchesDate = true;
      if (dateFilter !== "all") {
        const transactionDate = new Date(transaction.createdAt);
        const now = new Date();
        
        switch (dateFilter) {
          case "today":
            matchesDate = transactionDate.toDateString() === now.toDateString();
            break;
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = transactionDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = transactionDate >= monthAgo;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [paymentTransactions, searchTerm, statusFilter, dateFilter, subscriptionIdFilter]);

  // Calculate statistics
  const totalTransactions = filteredTransactions.length;
  const successfulPayments = filteredTransactions.filter(t => t.status === 'PAID' || t.status === 'ACTIVE').length;
  const pendingPayments = filteredTransactions.filter(t => t.status === 'PENDING').length;
  const totalRevenue = filteredTransactions
    .filter(t => t.status === 'PAID' || t.status === 'ACTIVE')
    .reduce((sum, t) => sum + t.amount, 0);
  const averageTransaction = successfulPayments > 0 ? totalRevenue / successfulPayments : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý thanh toán
            {subscriptionIdFilter && (
              <span className="text-base font-normal text-muted-foreground ml-2">
                - Đăng ký #{subscriptionIdFilter}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý tất cả giao dịch thanh toán
          </p>
        </div>
        <div className="flex items-center gap-2">
          {subscriptionIdFilter && (
            <Button variant="outline" asChild>
              <Link href="/manage/payments">
                Xem tất cả
              </Link>
            </Button>
          )}
          <Button 
            onClick={async () => {
              try {
                await refetch();
                toast.success('Đã cập nhật dữ liệu thanh toán thành công!');
              } catch (error) {
                toast.error('Có lỗi xảy ra khi tải dữ liệu');
              }
            }} 
            variant="outline" 
            disabled={isFetching}
          >
            <IconRefresh className={`size-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Đang tải...' : 'Làm mới'}
          </Button>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giao dịch</CardTitle>
            <IconCreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả giao dịch
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành công</CardTitle>
            <IconTrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successfulPayments}</div>
            <p className="text-xs text-muted-foreground">
              {totalTransactions > 0 ? Math.round((successfulPayments / totalTransactions) * 100) : 0}% tỷ lệ thành công
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
            <IconCalendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Cần theo dõi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <IconTrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              TB: {formatCurrency(averageTransaction)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="size-5" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo khách hàng, nhà hàng, mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                <SelectItem value="PAID">Đã thanh toán</SelectItem>
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="FAILED">Thất bại</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">7 ngày qua</SelectItem>
                <SelectItem value="month">30 ngày qua</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lịch sử giao dịch</CardTitle>
              <CardDescription>
                {filteredTransactions.length} kết quả
                {searchTerm && ` cho "${searchTerm}"`}
                {statusFilter !== "all" && ` với trạng thái "${statusFilter}"`}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <IconDownload className="size-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <IconCreditCard className="size-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "Không tìm thấy giao dịch"
                  : "Chưa có giao dịch nào"
                }
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Giao dịch đầu tiên sẽ xuất hiện ở đây"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã giao dịch</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Nhà hàng</TableHead>
                    <TableHead>Gói dịch vụ</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-mono text-sm">
                            {transaction.orderId}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Sub-{transaction.subscriptionId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {transaction.customerName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.customerEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {transaction.restaurantName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.servicePlanName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          {formatCurrency(transaction.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconCreditCard className="size-4 text-muted-foreground" />
                          <span className="text-sm">{transaction.paymentMethod}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(transaction.createdAt), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(transaction.createdAt), "HH:mm", {
                            locale: vi,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/manage/subscriptions/${transaction.subscriptionId}`}>
                              <IconEye className="size-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
