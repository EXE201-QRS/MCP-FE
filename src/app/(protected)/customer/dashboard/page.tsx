"use client"

export default function CustomerDashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Chào mừng trở lại!
        </h1>
        <p className="text-muted-foreground">
          Quản lý hệ thống QR Ordering của nhà hàng bạn một cách hiệu quả
        </p>
      </div>

      {/* Simple test content */}
      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded">
        <p className="text-blue-800 dark:text-blue-200">Customer Dashboard is loading successfully!</p>
        <p className="text-blue-600 dark:text-blue-300">If you see this, the routing is working.</p>
      </div>

      {/* Test Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded border">
          <h3 className="font-semibold">Total Orders</h3>
          <p className="text-2xl font-bold">2,847</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded border">
          <h3 className="font-semibold">Customers</h3>
          <p className="text-2xl font-bold">1,324</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded border">
          <h3 className="font-semibold">Revenue</h3>
          <p className="text-2xl font-bold">₫45,231,000</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded border">
          <h3 className="font-semibold">Rating</h3>
          <p className="text-2xl font-bold">4.8/5</p>
        </div>
      </div>
    </div>
  )
}
