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
      <div className="bg-blue-100 p-4 rounded">
        <p>Customer Dashboard is loading successfully!</p>
        <p>If you see this, the routing is working.</p>
      </div>
    </div>
  )
}
