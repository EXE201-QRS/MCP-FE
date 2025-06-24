"use client";

import {
  IconCreditCard,
  IconSettings,
  IconShoppingCart,
  IconStar,
  IconUser,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentActivities = [
  {
    id: 1,
    type: "order",
    title: "Đơn hàng mới #2847",
    description: "Bàn 12 - Combo gà rán + nước ngọt",
    time: "2 phút trước",
    icon: IconShoppingCart,
    status: "success",
    amount: "₫285,000",
  },
  {
    id: 2,
    type: "review",
    title: "Đánh giá mới",
    description: "Khách hàng Nguyễn Văn A đánh giá 5 sao",
    time: "15 phút trước",
    icon: IconStar,
    status: "success",
    rating: 5,
  },
  {
    id: 3,
    type: "payment",
    title: "Thanh toán thành công",
    description: "Gia hạn gói Professional",
    time: "1 giờ trước",
    icon: IconCreditCard,
    status: "success",
    amount: "₫399,000",
  },
  {
    id: 4,
    type: "setting",
    title: "Cập nhật menu",
    description: "Thêm 3 món mới vào danh mục đồ uống",
    time: "3 giờ trước",
    icon: IconSettings,
    status: "info",
  },
  {
    id: 5,
    type: "staff",
    title: "Nhân viên mới",
    description: "Trần Thị B đã được thêm vào hệ thống",
    time: "1 ngày trước",
    icon: IconUser,
    status: "info",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return <Badge variant="default" className="h-2 w-2 p-0 bg-green-500" />;
    case "warning":
      return <Badge variant="default" className="h-2 w-2 p-0 bg-yellow-500" />;
    case "error":
      return <Badge variant="default" className="h-2 w-2 p-0 bg-red-500" />;
    default:
      return <Badge variant="default" className="h-2 w-2 p-0 bg-blue-500" />;
  }
};

export function CustomerRecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                <activity.icon className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <div className="flex items-center space-x-2">
                    {activity.amount && (
                      <span className="text-sm font-semibold text-green-600">
                        {activity.amount}
                      </span>
                    )}
                    {activity.rating && (
                      <div className="flex items-center">
                        {[...Array(activity.rating)].map((_, i) => (
                          <IconStar
                            key={i}
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    )}
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
