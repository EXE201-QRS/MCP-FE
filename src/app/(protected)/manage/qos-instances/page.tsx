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
import { QosInstanceStatus } from "@/constants/qos-instance.constant";
import {
  useDeleteQosInstanceMutation,
  useGetQosInstanceList,
} from "@/hooks/useQosInstance";
import { handleErrorApi } from "@/lib/utils";
import {
  IconActivity,
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconDatabase,
  IconDots,
  IconEdit,
  IconEye,
  IconLoader,
  IconPlus,
  IconSearch,
  IconServer,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
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
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useGetQosInstanceList({ page, limit });
  const deleteQosInstanceMutation = useDeleteQosInstanceMutation();

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

  const getInitials = (name: string | null) => {
    if (!name) return "R";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getOverallStatus = (instance: any) => {
    const statuses = [instance.statusDb, instance.statusFE, instance.statusBE];

    if (statuses.includes(QosInstanceStatus.ERROR))
      return QosInstanceStatus.ERROR;
    if (statuses.includes(QosInstanceStatus.DEPLOYING))
      return QosInstanceStatus.DEPLOYING;
    if (statuses.includes(QosInstanceStatus.MAINTENANCE))
      return QosInstanceStatus.MAINTENANCE;
    if (statuses.every((s) => s === QosInstanceStatus.ACTIVE))
      return QosInstanceStatus.ACTIVE;
    return QosInstanceStatus.INACTIVE;
  };

  const StatusBadge = ({ status }: { status: keyof typeof statusConfig }) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <IconComponent className={`size-3 ${config.color}`} />
        {config.label}
      </Badge>
    );
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "0 MB";
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const filteredInstances =
    data?.payload.data?.filter(
      (instance) =>
        instance.subscription.restaurantName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        instance.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instance.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instance.dbName?.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý QOS Instances
          </h1>
          <p className="text-muted-foreground">
            Quản lý và giám sát các instance QR ordering system
          </p>
        </div>
        <Button asChild>
          <Link href="/manage/qos-instances/create">
            <IconPlus className="size-4 mr-2" />
            Tạo QOS Instance
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên nhà hàng, khách hàng, email hoặc database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* QOS Instances Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconDatabase className="size-5" />
            Danh sách QOS Instances
          </CardTitle>
          <CardDescription>
            {filteredInstances.length} / {data?.payload.data?.length || 0}{" "}
            instances
          </CardDescription>
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
              <IconDatabase className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery
                  ? "Không tìm thấy QOS Instance"
                  : "Chưa có QOS Instance nào"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Thử thay đổi từ khóa tìm kiếm hoặc tạo instance mới"
                  : "Tạo QOS Instance đầu tiên để bắt đầu cung cấp dịch vụ"}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/manage/qos-instances/create">
                    <IconPlus className="size-4 mr-2" />
                    Tạo QOS Instance
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhà hàng & Khách hàng</TableHead>
                    <TableHead>Database</TableHead>
                    <TableHead>Trạng thái Services</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Triển khai</TableHead>
                    <TableHead className="w-[70px]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstances.map((instance) => {
                    const overallStatus = getOverallStatus(instance);

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
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <IconDatabase className="size-3" />
                              <span className="text-sm font-mono">
                                {instance.dbName || "Chưa cấu hình"}
                              </span>
                            </div>
                            <StatusBadge status={instance.statusDb} />
                            {instance.dbSize && (
                              <div className="text-xs text-muted-foreground">
                                {formatBytes(instance.dbSize)}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <IconServer className="size-3" />
                              <span className="text-xs">FE:</span>
                              <StatusBadge status={instance.statusFE} />
                            </div>
                            <div className="flex items-center gap-2">
                              <IconServer className="size-3" />
                              <span className="text-xs">BE:</span>
                              <StatusBadge status={instance.statusBE} />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Tổng quan: <StatusBadge status={overallStatus} />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            {instance.responseTime && (
                              <div className="flex items-center gap-2">
                                <IconActivity className="size-3" />
                                <span className="text-xs">
                                  {instance.responseTime}ms
                                </span>
                              </div>
                            )}
                            {instance.uptime && (
                              <div className="flex items-center gap-2">
                                <IconClock className="size-3" />
                                <span className="text-xs">
                                  {instance.uptime.toFixed(1)}%
                                </span>
                              </div>
                            )}
                            {instance.lastPing && (
                              <div className="text-xs text-muted-foreground">
                                Ping:{" "}
                                {format(new Date(instance.lastPing), "HH:mm", {
                                  locale: vi,
                                })}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            {instance.version && (
                              <div className="text-xs font-mono">
                                v{instance.version}
                              </div>
                            )}
                            {instance.deployedAt ? (
                              <div className="text-xs text-muted-foreground">
                                {format(
                                  new Date(instance.deployedAt),
                                  "dd/MM/yyyy",
                                  { locale: vi }
                                )}
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Chưa triển khai
                              </Badge>
                            )}
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
          )}

          {/* Pagination */}
          {data?.payload && data.payload.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Trang {data.payload.page} / {data.payload.totalPages}(
                {data.payload.totalItems} instances)
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
