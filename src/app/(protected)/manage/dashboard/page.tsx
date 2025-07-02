"use client";

import dashboardApiRequest, { DashboardQuery } from "@/apiRequests/dashboard";
import {
  CustomerSegmentsChart,
  GeographicRevenueChart,
} from "@/components/dashboard/customer-geographic";
import OverviewCards from "@/components/dashboard/overview-cards";
import PeriodSelector from "@/components/dashboard/period-selector";
import RevenueChart from "@/components/dashboard/revenue-chart";
import ServicePlanRevenueChart from "@/components/dashboard/service-plan-revenue";
import {
  RecentTransactionsTable,
  TopCustomersTable,
} from "@/components/dashboard/tables";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Download,
  MapPin,
  PieChart,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y" | "custom">(
    "30d"
  );
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("area");
  const [servicePlanChartType, setServicePlanChartType] = useState<
    "pie" | "bar"
  >("pie");

  // Prepare query parameters
  const queryParams: DashboardQuery = {
    period,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    timeZone: "Asia/Ho_Chi_Minh",
  };

  // Main analytics query
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["dashboard-analytics", queryParams],
    queryFn: () => dashboardApiRequest.getAnalytics(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Individual queries for better performance and caching
  const {
    data: revenueChart,
    isLoading: revenueChartLoading,
    refetch: refetchRevenueChart,
  } = useQuery({
    queryKey: ["revenue-chart", { ...queryParams, granularity: "day" }],
    queryFn: () =>
      dashboardApiRequest.getRevenueChart({
        ...queryParams,
        granularity: "day",
      }),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: servicePlanRevenue,
    isLoading: servicePlanLoading,
    refetch: refetchServicePlan,
  } = useQuery({
    queryKey: ["service-plan-revenue", queryParams],
    queryFn: () => dashboardApiRequest.getServicePlanRevenue(queryParams),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: topCustomers,
    isLoading: topCustomersLoading,
    refetch: refetchTopCustomers,
  } = useQuery({
    queryKey: ["top-customers", { ...queryParams, limit: 10 }],
    queryFn: () =>
      dashboardApiRequest.getTopCustomers({ ...queryParams, limit: 10 }),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: recentTransactions,
    isLoading: recentTransactionsLoading,
    refetch: refetchRecentTransactions,
  } = useQuery({
    queryKey: ["recent-transactions", 10],
    queryFn: () => dashboardApiRequest.getRecentTransactions(10),
    staleTime: 2 * 60 * 1000, // More frequent updates for transactions
  });

  // Handle period change
  const handlePeriodChange = (newPeriod: typeof period) => {
    setPeriod(newPeriod);
    if (newPeriod !== "custom") {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  // Handle date change for custom period
  const handleDateChange = (
    newStartDate: Date | undefined,
    newEndDate: Date | undefined
  ) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Refresh all data
  const handleRefreshAll = async () => {
    try {
      await Promise.all([
        refetchAnalytics(),
        refetchRevenueChart(),
        refetchServicePlan(),
        refetchTopCustomers(),
        refetchRecentTransactions(),
      ]);
      toast.success("Dữ liệu đã được cập nhật");
    } catch (error) {
      toast.error("Có lỗi khi cập nhật dữ liệu");
    }
  };

  // Export data (placeholder)
  const handleExportData = () => {
    toast.info("Tính năng xuất dữ liệu đang được phát triển");
  };

  // Handle errors
  useEffect(() => {
    if (analyticsError) {
      toast.error("Có lỗi khi tải dữ liệu dashboard");
    }
  }, [analyticsError]);

  const isLoading =
    analyticsLoading || revenueChartLoading || servicePlanLoading;

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard Analytics
            </h1>
            <p className="text-muted-foreground">
              Tổng quan doanh thu và hiệu suất kinh doanh
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Làm mới
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Xuất dữ liệu
            </Button>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <PeriodSelector
              period={period}
              startDate={startDate}
              endDate={endDate}
              onPeriodChange={handlePeriodChange}
              onDateChange={handleDateChange}
              isLoading={isLoading}
            />
          </div>

          {/* Overview Cards */}
          <div className="lg:col-span-3">
            <OverviewCards
              data={
                analytics?.payload?.data?.overview || {
                  totalRevenue: 0,
                  revenueGrowth: 0,
                  totalOrders: 0,
                  ordersGrowth: 0,
                  totalCustomers: 0,
                  customersGrowth: 0,
                  totalActiveInstances: 0,
                  instancesGrowth: 0,
                  averageOrderValue: 0,
                  aovGrowth: 0,
                  conversionRate: 0,
                  conversionGrowth: 0,
                }
              }
              isLoading={analyticsLoading}
            />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="px-4 lg:px-6">
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="revenue"
              className="flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Doanh Thu</span>
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="flex items-center space-x-2"
            >
              <PieChart className="h-4 w-4" />
              <span>Dịch Vụ</span>
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Khách Hàng</span>
            </TabsTrigger>
            <TabsTrigger
              value="geographic"
              className="flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span>Khu Vực</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Phân Tích</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Biểu Đồ Doanh Thu</h3>
              <Select
                value={chartType}
                onValueChange={(value: any) => setChartType(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="area">Vùng</SelectItem>
                  <SelectItem value="line">Đường</SelectItem>
                  <SelectItem value="bar">Cột</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <RevenueChart
              data={revenueChart?.payload?.data || []}
              isLoading={revenueChartLoading}
              chartType={chartType}
              showCumulative={true}
            />
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Doanh Thu Theo Gói Dịch Vụ
              </h3>
              <Select
                value={servicePlanChartType}
                onValueChange={(value: any) => setServicePlanChartType(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pie">Tròn</SelectItem>
                  <SelectItem value="bar">Cột</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ServicePlanRevenueChart
              data={servicePlanRevenue?.payload?.data || []}
              isLoading={servicePlanLoading}
              chartType={servicePlanChartType}
            />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <h3 className="text-lg font-semibold">Phân Tích Khách Hàng</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomerSegmentsChart
                data={analytics?.payload?.data?.customerSegments || []}
                isLoading={analyticsLoading}
              />
              <TopCustomersTable
                data={topCustomers?.payload?.data || []}
                isLoading={topCustomersLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="geographic" className="space-y-6">
            <h3 className="text-lg font-semibold">Phân Bố Theo Khu Vực</h3>
            <GeographicRevenueChart
              data={analytics?.payload?.data?.geographicRevenue || []}
              isLoading={analyticsLoading}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h3 className="text-lg font-semibold">Phân Tích Chi Tiết</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Phương Thức Thanh Toán</CardTitle>
                  <CardDescription>
                    Thống kê theo phương thức thanh toán
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="h-40 w-full animate-pulse bg-muted rounded"></div>
                  ) : (
                    <div className="space-y-4">
                      {analytics?.payload?.data?.paymentMethodStats?.map(
                        (method, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm font-medium">
                              {method.method}
                            </span>
                            <div className="text-right">
                              <div className="text-sm font-semibold">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(method.revenue)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {method.orders} đơn (
                                {method.percentage.toFixed(1)}%)
                              </div>
                            </div>
                          </div>
                        )
                      ) || (
                        <p className="text-muted-foreground">
                          Không có dữ liệu
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <RecentTransactionsTable
                data={recentTransactions?.payload?.data || []}
                isLoading={recentTransactionsLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
