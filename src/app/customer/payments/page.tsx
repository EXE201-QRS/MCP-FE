"use client"

import { IconDownload, IconCreditCard, IconCheck, IconClock, IconX } from "@tabler/icons-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const paymentHistory = [
  {
    id: "PAY-2024-001",
    date: "15/12/2024",
    amount: "599,000",
    plan: "Professional",
    status: "paid",
    method: "Thẻ tín dụng",
    invoice: "INV-2024-001.pdf",
  },
  {
    id: "PAY-2024-002", 
    date: "15/11/2024",
    amount: "599,000",
    plan: "Professional",
    status: "paid",
    method: "Chuyển khoản",
    invoice: "INV-2024-002.pdf",
  },
  {
    id: "PAY-2024-003",
    date: "15/10/2024", 
    amount: "599,000",
    plan: "Professional",
    status: "paid",
    method: "Thẻ tín dụng",
    invoice: "INV-2024-003.pdf",
  },
  {
    id: "PAY-2024-004",
    date: "15/09/2024",
    amount: "299,000", 
    plan: "Basic",
    status: "paid",
    method: "Chuyển khoản",
    invoice: "INV-2024-004.pdf",
  },
  {
    id: "PAY-2024-005",
    date: "15/01/2025",
    amount: "599,000",
    plan: "Professional", 
    status: "pending",
    method: "Thẻ tín dụng",
    invoice: null,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return (
        <Badge variant="default" className="bg-green-500 text-white">
          <IconCheck className="mr-1 h-3 w-3" />
          Đã thanh toán
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary">
          <IconClock className="mr-1 h-3 w-3" />
          Chờ thanh toán
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="destructive">
          <IconX className="mr-1 h-3 w-3" />
          Thất bại
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function CustomerPaymentsPage() {
  const totalPaid = paymentHistory
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + parseInt(p.amount.replace(",", "")), 0)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Lịch sử thanh toán</h1>
        <p className="text-muted-foreground">
          Quản lý và theo dõi các giao dịch thanh toán của bạn
        </p>
      </div>

      {/* Payment Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đã thanh toán</CardTitle>
            <IconCreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₫{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Năm 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thanh toán tiếp theo</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15/01/2025</div>
            <p className="text-xs text-muted-foreground">₫599,000</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phương thức</CardTitle>
            <IconCreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">**** 1234</div>
            <p className="text-xs text-muted-foreground">Visa</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Phương thức thanh toán</CardTitle>
          <CardDescription>
            Quản lý thông tin thanh toán của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <IconCreditCard className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">Visa •••• 1234</p>
                <p className="text-sm text-muted-foreground">Hết hạn 12/2027</p>
              </div>
            </div>
            <Badge variant="default">Mặc định</Badge>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">Thêm phương thức thanh toán</Button>
            <Button variant="outline">Cập nhật thông tin</Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
          <CardDescription>
            Danh sách tất cả giao dịch thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã giao dịch</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Gói dịch vụ</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hóa đơn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">
                    {payment.id}
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.plan}</Badge>
                  </TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="font-semibold">
                    ₫{parseInt(payment.amount.replace(",", "")).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell>
                    {payment.invoice ? (
                      <Button variant="ghost" size="sm">
                        <IconDownload className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
