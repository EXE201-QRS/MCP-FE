"use client";

import { PageSizeSelector } from "@/components/common/page-size-selector";
import {
  PaginationControls,
  PaginationInfo,
} from "@/components/common/pagination-controls";
import { QosHealthCard } from "@/components/qos-health/QosHealthCard";
import {
  OverallServiceStatus,
  ServiceStatusIndicator,
} from "@/components/qos-status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { QosInstanceStatus } from "@/constants/qos-instance.constant";
import { useClientFilter, usePagination } from "@/hooks/usePagination";
import {
  useDeleteQosInstanceMutation,
  useGetQosInstanceList,
} from "@/hooks/useQosInstance";
import { handleErrorApi } from "@/lib/utils";
import {
  IconAlertTriangle,
  IconCheck,
  IconDatabase,
  IconDots,
  IconEdit,
  IconEye,
  IconLoader,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { Wrench } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const statusConfig = {
  [QosInstanceStatus.ACTIVE]: {
    icon: IconCheck,
    variant: "default" as const,
    label: "Hoạt động",
    color: "text-green-500",
  },
  [QosInstanceStatus.INACTIVE]: {
    icon: IconX,
    variant: "secondary" as const,
    label: "Không hoạt động",
    color: "text-gray-500",
  },
  [QosInstanceStatus.MAINTENANCE]: {
    icon: Wrench,
    variant: "outline" as const,
    label: "Bảo trì",
    color: "text-yellow-500",
  },
  [QosInstanceStatus.DEPLOYING]: {
    icon: IconLoader,
    variant: "outline" as const,
    label: "Đang triển khai",
    color: "text-blue-500",
  },
  [QosInstanceStatus.ERROR]: {
    icon: IconAlertTriangle,
    variant: "destructive" as const,
    label: "Lỗi",
    color: "text-red-500",
  },
};

export default function QosInstancesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Use pagination hook
  const { currentPage, pageSize, handlePageChange, handlePageSizeChange } =
    usePagination({
      initialPage: 1,
      initialPageSize: 10,
    });

  const { data, isLoading, error, refetch, isFetching } = useGetQosInstanceList(
    { page: currentPage, limit: pageSize }
  );
  const deleteQosInstanceMutation = useDeleteQosInstanceMutation();

  // Client-side filtering for current page data
  const rawData = data?.payload?.data || [];
  const filteredInstances = useClientFilter({
    data: rawData,
    searchTerm,
    statusFilter: "all", // No status filter for QOS instances
    searchFields: [
      "subscription.restaurantName",
      "user.name",
      "user.email",
      "dbName",
    ],
    statusField: "statusBE", // Dummy field since we don't filter by status
  });

  const handleDelete = async (id: number, restaurantName: string) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa QOS Instance cho "${restaurantName}" không?`
      )
    ) {
      return;
    }

    try {
      await deleteQosInstanceMutation.mutateAsync(id);
      toast.success("Xóa QOS Instance thành công!");
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Đã cập nhật dữ liệu QOS instances thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải dữ liệu");
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "R";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Pagination data from API response
  const paginationData = data?.payload
    ? {
        currentPage: data.payload.page,
        totalPages: data.payload.totalPages,
        totalItems: data.payload.totalItems,
        limit: data.payload.limit,
      }
    : {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: pageSize,
      };

  const hasSearch = searchTerm.length > 0;
  const showingFiltered =
    hasSearch && filteredInstances.length !== rawData.length;

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
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý QOS Instances
          </h1>
          <p className="text-muted-foreground">
            Quản lý và giám sát các instance QR ordering system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isFetching}
          >
            <IconRefresh
              className={`size-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            {isFetching ? "Đang tải..." : "Làm mới"}
          </Button>
          <Button asChild>
            <Link href="/manage/qos-instances/create">
              <IconPlus className="size-4 mr-2" />
              Tạo QOS Instance
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <IconSearch className="size-5" />
              Tìm kiếm
            </CardTitle>
            {hasSearch && (
              <Button variant="outline" size="sm" onClick={handleClearSearch}>
                Xóa tìm kiếm
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên nhà hàng, khách hàng, email hoặc database..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* QOS Instances Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconDatabase className="size-5" />
                Danh sách QOS Instances
              </CardTitle>
              <CardDescription>
                {showingFiltered ? (
                  <>
                    Hiển thị {filteredInstances.length} / {rawData.length} kết
                    quả trên trang này
                    {searchTerm && ` cho "${searchTerm}"`}
                  </>
                ) : (
                  <>{filteredInstances.length} kết quả trên trang này</>
                )}
              </CardDescription>
            </div>
            {/* Page Size Selector ở góc phải */}
            {!isLoading && paginationData.totalItems > 0 && (
              <PageSizeSelector
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                options={[5, 10, 20, 50]}
                disabled={isFetching}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-muted animate-pulse rounded-md"
                />
              ))}
            </div>
          ) : filteredInstances.length === 0 ? (
            <div className="text-center py-12">
              <IconDatabase className="size-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {hasSearch
                  ? "Không tìm thấy QOS Instance"
                  : "Chưa có QOS Instance nào"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {hasSearch
                  ? "Thử thay đổi từ khóa tìm kiếm hoặc tạo instance mới"
                  : "Tạo QOS Instance đầu tiên để bắt đầu cung cấp dịch vụ"}
              </p>
              {hasSearch ? (
                <Button onClick={handleClearSearch} variant="outline">
                  Xóa tìm kiếm
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/manage/qos-instances/create">
                    <IconPlus className="size-4 mr-2" />
                    Tạo QOS Instance
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nhà hàng & Khách hàng</TableHead>
                      <TableHead>Trạng thái tổng quan</TableHead>
                      <TableHead>Frontend Service</TableHead>
                      <TableHead>Backend Service</TableHead>
                      <TableHead>Health Metrics</TableHead>
                      <TableHead className="w-[70px]">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstances.map((instance) => {
                      return (
                        <TableRow key={instance.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="size-8">
                                <AvatarImage src={instance.user.avatar || ""} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(
                                    instance.subscription.restaurantName
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {instance.subscription.restaurantName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {instance.user.name || instance.user.email}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  ID: {instance.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <OverallServiceStatus
                              subscriptionId={instance.subscription.id}
                              compact={true}
                            />
                          </TableCell>

                          <TableCell>
                            <ServiceStatusIndicator
                              subscriptionId={instance.subscription.id}
                              service="frontend"
                              showUrl={false}
                              compact={false}
                            />
                          </TableCell>

                          <TableCell>
                            <ServiceStatusIndicator
                              subscriptionId={instance.subscription.id}
                              service="backend"
                              showUrl={false}
                              compact={false}
                            />
                          </TableCell>

                          <TableCell>
                            <QosHealthCard
                              subscriptionId={instance.subscription.id}
                              qosInstanceId={instance.id}
                              compact={true}
                            />
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
                                    href={`/manage/qos-instances/${instance.id}`}
                                  >
                                    <IconEye className="size-4 mr-2" />
                                    Xem chi tiết
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/manage/qos-instances/${instance.id}/edit`}
                                  >
                                    <IconEdit className="size-4 mr-2" />
                                    Chỉnh sửa
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    handleDelete(
                                      instance.id,
                                      instance.subscription.restaurantName
                                    )
                                  }
                                  disabled={deleteQosInstanceMutation.isPending}
                                >
                                  <IconTrash className="size-4 mr-2" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination info và navigation trong table */}
              {!isLoading && paginationData.totalItems > 0 && (
                <div className="border-t pt-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <PaginationInfo
                        currentPage={paginationData.currentPage}
                        totalPages={paginationData.totalPages}
                        totalItems={paginationData.totalItems}
                        limit={paginationData.limit}
                        itemName="instances"
                      />
                      {hasSearch && (
                        <div className="text-sm text-orange-600">
                          Lọc: {filteredInstances.length} kết quả
                        </div>
                      )}
                    </div>
                    <div>
                      {paginationData.totalPages > 1 && (
                        <PaginationControls
                          currentPage={paginationData.currentPage}
                          totalPages={paginationData.totalPages}
                          onPageChange={handlePageChange}
                          disabled={isFetching}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
