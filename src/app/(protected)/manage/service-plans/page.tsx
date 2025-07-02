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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteServicePlanMutation,
  useGetServicePlanList,
} from "@/hooks/useServicePlan";
import { handleErrorApi } from "@/lib/utils";
import {
  IconDots,
  IconEdit,
  IconPackages,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ServicePlansPage() {
  const [page] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error } = useGetServicePlanList({ page, limit });
  const deleteServicePlanMutation = useDeleteServicePlanMutation();

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa gói dịch vụ "${name}" không?`)) {
      return;
    }

    try {
      await deleteServicePlanMutation.mutateAsync(id);
      toast.success("Xóa gói dịch vụ thành công!");
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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
    <div className="container mx-auto py-8 space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gói dịch vụ</h1>
          <p className="text-muted-foreground">
            Quản lý các gói dịch vụ QR Ordering System
          </p>
        </div>
        <Button asChild>
          <Link href="/manage/service-plans/create">
            <IconPlus className="size-4 mr-2" />
            Thêm gói dịch vụ
          </Link>
        </Button>
      </div>

      {/* Service Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPackages className="size-5" />
            Danh sách gói dịch vụ
          </CardTitle>
          <CardDescription>
            {data?.payload.data?.length || 0} gói dịch vụ đang hoạt động
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted animate-pulse rounded-md"
                />
              ))}
            </div>
          ) : data?.payload.data?.length === 0 ? (
            <div className="text-center py-12">
              <IconPackages className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Chưa có gói dịch vụ nào
              </h3>
              <p className="text-muted-foreground mb-4">
                Tạo gói dịch vụ đầu tiên để bắt đầu cung cấp dịch vụ cho khách
                hàng
              </p>
              <Button asChild>
                <Link href="/manage/service-plans/create">
                  <IconPlus className="size-4 mr-2" />
                  Thêm gói dịch vụ
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên gói</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Số lượng đăng ký</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="w-[70px]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.payload.data?.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="font-medium">{plan.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          {plan.description ? (
                            <span className="text-sm text-muted-foreground">
                              {plan.description}
                            </span>
                          ) : (
                            <Badge variant="outline">Không có mô tả</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(plan.price)}
                          <span className="text-xs text-muted-foreground ml-1">
                            /tháng
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {plan.subscribersCount || 0} đăng ký
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(plan.createdAt), "dd/MM/yyyy", {
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
                              <Link
                                href={`/manage/service-plans/${plan.id}/edit`}
                              >
                                <IconEdit className="size-4 mr-2" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(plan.id, plan.name)}
                              disabled={deleteServicePlanMutation.isPending}
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
        </CardContent>
      </Card>
    </div>
  );
}
