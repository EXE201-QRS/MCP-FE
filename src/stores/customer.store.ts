"use client"

import { create } from "zustand"

interface CustomerDashboardState {
  // Stats
  totalOrders: number
  totalCustomers: number
  totalRevenue: string
  averageRating: number
  
  // Subscription
  currentPlan: string
  subscriptionStatus: "active" | "expired" | "cancelled"
  nextBilling: string
  
  // Actions
  setStats: (stats: {
    totalOrders: number
    totalCustomers: number
    totalRevenue: string
    averageRating: number
  }) => void
  
  setSubscription: (subscription: {
    currentPlan: string
    subscriptionStatus: "active" | "expired" | "cancelled"
    nextBilling: string
  }) => void
}

export const useCustomerStore = create<CustomerDashboardState>()((set) => ({
  // Initial state - mock data
  totalOrders: 2847,
  totalCustomers: 1324,
  totalRevenue: "₫45,231,000",
  averageRating: 4.8,
  
  currentPlan: "Professional",
  subscriptionStatus: "active",
  nextBilling: "15/01/2025",
  
  // Actions
  setStats: (stats) => set(stats),
  setSubscription: (subscription) => set(subscription),
}))
