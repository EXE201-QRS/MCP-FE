"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role } from "@/constants/auth.constant";
import {
  useDeleteUserMutation,
  useGetUserList,
} from "@/hooks/useUser";
import { handleErrorApi } from "@/lib/utils";
import {
  IconDots,
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useGetUserList({ 
    page, 
    limit,
    role: Role.CUSTOMER 
  });
  const deleteUserMutation = useDeleteUserMutation();

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khách hàng "${name}" không?`)) {
      return;
    }

    try {
      await deleteUserMutation.mutateAsync(id);
      toast.success("Xóa khách hàng thành công!");
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredCustomers = data?.payload.data?.filter((customer) =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin các khách hàng sử dụng dịch vụ
          </p>
        </div>
        <Button asChild>
          <Link href="/manage/customers/create">
            <IconPlus className="size-4 mr-2" />
            Thêm khách hàng
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUsers className="size-5" />
            Danh sách khách hàng
          </CardTitle>
          <CardDescription>
            {filteredCustomers.length} / {data?.payload.data?.length || 0} khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted animate-pulse rounded-md"
                />
              ))}
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <IconUsers className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "Không tìm thấy khách hàng" : "Chưa có khách hàng nào"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? "Thử thay đổi từ khóa tìm kiếm hoặc tạo khách hàng mới"
                  : "Thêm khách hàng đầu tiên để bắt đầu quản lý"
                }
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/manage/customers/create">
                    <IconPlus className="size-4 mr-2" />
                    Thêm khách hàng
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="w-[70px]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage src={customer.avatar || ""} />
                            <AvatarFallback className="text-xs">
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {customer.name || "Chưa cập nhật"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ID: {customer.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">{customer.email}</div>
                      </TableCell>
                      <TableCell>
                        {customer.phoneNumber ? (
                          <div className="font-mono text-sm">
                            {customer.phoneNumber}
                          </div>
                        ) : (
                          <Badge variant="outline">Chưa cập nhật</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(customer.createdAt), "dd/MM/yyyy HH:mm", {
                            locale: vi,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <IconDots className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/manage/customers/${customer.id}`}>
                                <IconEye className="size-4 mr-2" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/manage/customers/${customer.id}/edit`}>
                                <IconEdit className="size-4 mr-2" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(customer.id, customer.name || customer.email)}
                              disabled={deleteUserMutation.isPending}
                            >
                              <IconTrash className="size-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {data?.payload && data.payload.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Trang {data.payload.page} / {data.payload.totalPages} 
                ({data.payload.totalItems} khách hàng)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.payload.totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
