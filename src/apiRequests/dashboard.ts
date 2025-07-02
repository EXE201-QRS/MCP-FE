import http from "@/lib/http";

// ===== DASHBOARD TYPES =====
export interface DashboardOverview {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  totalCustomers: number;
  customersGrowth: number;
  totalActiveInstances: number;
  instancesGrowth: number;
  averageOrderValue: number;
  aovGrowth: number;
  conversionRate: number;
  conversionGrowth: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  orders: number;
  cumulativeRevenue: number;
}

export interface ServicePlanRevenue {
  servicePlanId: number;
  servicePlanName: string;
  revenue: number;
  orders: number;
  percentage: number;
  growth: number;
}

export interface PaymentMethodStats {
  method: string;
  revenue: number;
  orders: number;
  percentage: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
  averageValue: number;
  percentage: number;
}

export interface GeographicRevenue {
  region: string;
  revenue: number;
  orders: number;
  percentage: number;
}

export interface TopCustomer {
  userId: number;
  userName: string;
  email: string;
  totalRevenue: number;
  totalOrders: number;
  lastOrderDate: string;
}

export interface RecentTransaction {
  paymentId: number;
  customerName: string;
  servicePlanName: string;
  amount: number;
  status: string;
  paidAt: string;
}

export interface RevenueAnalytics {
  overview: DashboardOverview;
  revenueChart: RevenueChartData[];
  servicePlansRevenue: ServicePlanRevenue[];
  paymentMethodStats: PaymentMethodStats[];
  customerSegments: CustomerSegment[];
  geographicRevenue: GeographicRevenue[];
  topCustomers: TopCustomer[];
  recentTransactions: RecentTransaction[];
}

export interface RevenueForecast {
  date: string;
  predictedRevenue: number;
  confidence: number;
}

export interface CohortAnalysis {
  cohorts: any[];
  retentionRates: any[];
  averageLifetimeValue: number;
}

export interface SeasonalTrends {
  monthlyTrends: any[];
  weeklyTrends: any[];
  dailyTrends: any[];
}

// ===== QUERY PARAMETERS =====
export interface DashboardQuery {
  period?: "7d" | "30d" | "90d" | "1y" | "custom";
  startDate?: string;
  endDate?: string;
  timeZone?: string;
}

export interface RevenueChartQuery extends DashboardQuery {
  granularity?: "hour" | "day" | "week" | "month";
}

export interface ServicePlanRevenueQuery extends DashboardQuery {}

// ===== API REQUESTS =====
const dashboardApiRequest = {
  // Get comprehensive dashboard analytics
  getAnalytics: (params?: DashboardQuery) => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append("period", params.period);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.timeZone) searchParams.append("timeZone", params.timeZone);

    return http.get<{
      success: boolean;
      message: string;
      data: RevenueAnalytics;
    }>(`/manage/dashboard/analytics?${searchParams.toString()}`);
  },

  // Get dashboard overview
  getOverview: (params?: DashboardQuery) => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append("period", params.period);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.timeZone) searchParams.append("timeZone", params.timeZone);

    return http.get<{
      success: boolean;
      message: string;
      data: DashboardOverview;
    }>(`/manage/dashboard/overview?${searchParams.toString()}`);
  },

  // Get revenue chart data
  getRevenueChart: (params?: RevenueChartQuery) => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append("period", params.period);
    if (params?.granularity)
      searchParams.append("granularity", params.granularity);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.timeZone) searchParams.append("timeZone", params.timeZone);

    return http.get<{
      success: boolean;
      message: string;
      data: RevenueChartData[];
    }>(`/manage/dashboard/revenue-chart?${searchParams.toString()}`);
  },

  // Get service plan revenue
  getServicePlanRevenue: (params?: ServicePlanRevenueQuery) => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append("period", params.period);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.timeZone) searchParams.append("timeZone", params.timeZone);

    return http.get<{
      success: boolean;
      message: string;
      data: ServicePlanRevenue[];
    }>(`/manage/dashboard/service-plan-revenue?${searchParams.toString()}`);
  },

  // Get payment method statistics
  getPaymentMethodStats: (params?: DashboardQuery) => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append("period", params.period);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.timeZone) searchParams.append("timeZone", params.timeZone);

    return http.get<{
      success: boolean;
      message: string;
      data: PaymentMethodStats[];
    }>(`/manage/dashboard/payment-methods?${searchParams.toString()}`);
  },

  // Get customer segments
  getCustomerSegments: (params?: DashboardQuery) => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append("period", params.period);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.timeZone) searchParams.append("timeZone", params.timeZone);

    return http.get<{
      success: boolean;
      message: string;
      data: CustomerSegment[];
    }>(`/manage/dashboard/customer-segments?${searchParams.toString()}`);
  },

  // Get geographic revenue
  getGeographicRevenue: (params?: DashboardQuery) => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append("period", params.period);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.timeZone) searchParams.append("timeZone", params.timeZone);

    return http.get<{
      success: boolean;
      message: string;
      data: GeographicRevenue[];
    }>(`/manage/dashboard/geographic-revenue?${searchParams.toString()}`);
  },

  // Get top customers
  getTopCustomers: (params?: DashboardQuery & { limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append("period", params.period);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.timeZone) searchParams.append("timeZone", params.timeZone);
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    return http.get<{
      success: boolean;
      message: string;
      data: TopCustomer[];
    }>(`/manage/dashboard/top-customers?${searchParams.toString()}`);
  },

  // Get recent transactions
  getRecentTransactions: (limit?: number) => {
    const searchParams = new URLSearchParams();
    if (limit) searchParams.append("limit", limit.toString());

    return http.get<{
      success: boolean;
      message: string;
      data: RecentTransaction[];
    }>(`/manage/dashboard/recent-transactions?${searchParams.toString()}`);
  },

  // Get revenue forecast
  getRevenueForecast: (days?: number) => {
    const searchParams = new URLSearchParams();
    if (days) searchParams.append("days", days.toString());

    return http.get<{
      success: boolean;
      message: string;
      data: RevenueForecast[];
    }>(`/manage/dashboard/revenue-forecast?${searchParams.toString()}`);
  },

  // Get cohort analysis
  getCohortAnalysis: (months?: number) => {
    const searchParams = new URLSearchParams();
    if (months) searchParams.append("months", months.toString());

    return http.get<{
      success: boolean;
      message: string;
      data: CohortAnalysis;
    }>(`/manage/dashboard/cohort-analysis?${searchParams.toString()}`);
  },

  // Get seasonal trends
  getSeasonalTrends: () => {
    return http.get<{
      success: boolean;
      message: string;
      data: SeasonalTrends;
    }>("/manage/dashboard/seasonal-trends");
  },
};

export default dashboardApiRequest;
