"use client";

import {
  IconChartBar,
  IconCreditCard,
  IconMessageCircle,
  IconSettings,
  IconShield,
  IconUsers,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Dashboard Thông minh",
    description:
      "Theo dõi doanh thu, khách hàng và hiệu suất kinh doanh real-time với dashboard trực quan.",
    icon: IconChartBar,
    badge: "Analytics",
  },
  {
    title: "Quản lý Khách hàng",
    description:
      "Quản lý thông tin nhà hàng, gói dịch vụ và lịch sử giao dịch một cách dễ dàng.",
    icon: IconUsers,
    badge: "CRM",
  },
  {
    title: "Thanh toán Tự động",
    description:
      "Tích hợp PayOS cho thanh toán online an toàn, tự động tạo hóa đơn và theo dõi giao dịch.",
    icon: IconCreditCard,
    badge: "Payment",
  },
  {
    title: "Quản lý QOS Instance",
    description:
      "Giám sát và quản lý tất cả hệ thống QOS đã triển khai, health check và monitoring.",
    icon: IconSettings,
    badge: "Monitoring",
  },
  {
    title: "Reviews & Ratings",
    description:
      "Thu thập và quản lý đánh giá từ khách hàng, phân tích sentiment và cải thiện dịch vụ.",
    icon: IconMessageCircle,
    badge: "Feedback",
  },
  {
    title: "Bảo mật Cao",
    description:
      "JWT authentication, mã hóa dữ liệu và tuân thủ các tiêu chuẩn bảo mật cao nhất.",
    icon: IconShield,
    badge: "Security",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-8">
            Tính năng nổi bật
          </Badge>
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Tất cả trong một nền tảng
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-lg text-muted-foreground">
            Scanorderly cung cấp đầy đủ công cụ để quản lý và vận hành hệ thống
            QR Ordering một cách hiệu quả và chuyên nghiệp.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group hover:shadow-lg transition-all duration-300 border-border/50"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComponent className="size-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">
              Nhà hàng tin dùng
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime đảm bảo</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">Hỗ trợ kỹ thuật</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">1M+</div>
            <div className="text-sm text-muted-foreground">Đơn hàng xử lý</div>
          </div>
        </div>
      </div>
    </section>
  );
}
