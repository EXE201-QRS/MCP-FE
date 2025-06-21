import {
  IconArrowLeft,
  IconBrandZapier,
  IconChartBar,
  IconCheck,
  IconCreditCard,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

import { DemoDialog } from "@/components/demo/demo-dialog";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import images placeholder
import dashboardImage from "@/assets/dashboard.png";

const mainFeatures = [
  {
    title: "Dashboard Thông minh",
    description:
      "Theo dõi doanh thu, khách hàng và hiệu suất kinh doanh real-time với dashboard trực quan và báo cáo chi tiết.",
    icon: IconChartBar,
    image: dashboardImage,
    benefits: [
      "Real-time analytics và reporting",
      "Customizable dashboard widgets",
      "Export báo cáo PDF/Excel",
      "Mobile-responsive design",
    ],
  },
  {
    title: "Quản lý Khách hàng",
    description:
      "Quản lý thông tin nhà hàng, gói dịch vụ và lịch sử giao dịch một cách dễ dàng và hiệu quả.",
    icon: IconUsers,
    image: dashboardImage,
    benefits: [
      "CRM tích hợp đầy đủ",
      "Customer lifecycle tracking",
      "Automated communication",
      "Segmentation và targeting",
    ],
  },
  {
    title: "Thanh toán Tự động",
    description:
      "Tích hợp PayOS cho thanh toán online an toàn, tự động tạo hóa đơn và theo dõi giao dịch.",
    icon: IconCreditCard,
    image: dashboardImage,
    benefits: [
      "Multiple payment gateways",
      "Automatic invoice generation",
      "Recurring billing support",
      "PCI DSS compliant",
    ],
  },
];

export default function ProductPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href="/"
                className="hover:text-foreground flex items-center gap-1"
              >
                <IconArrowLeft className="size-4" />
                Trang chủ
              </Link>
              <span>/</span>
              <span className="text-foreground">Sản phẩm</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="outline" className="mb-8">
                <IconBrandZapier className="mr-1 size-3" />
                Tính năng toàn diện
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Giải pháp{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  QR Ordering System
                </span>{" "}
                hoàn hảo
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                Khám phá đầy đủ các tính năng mạnh mẽ của QOS Scanorderly, được
                thiết kế để tối ưu hóa vận hành nhà hàng của bạn.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <DemoDialog>
                  <Button size="lg">Xem demo trực tiếp</Button>
                </DemoDialog>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">Tư vấn miễn phí</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-20">
              {mainFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                const isReverse = index % 2 === 1;

                return (
                  <div
                    key={feature.title}
                    className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center"
                  >
                    <div className={isReverse ? "lg:order-2" : ""}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <IconComponent className="size-6" />
                        </div>
                        <h2 className="text-3xl font-bold">{feature.title}</h2>
                      </div>
                      <p className="text-lg text-muted-foreground mb-8">
                        {feature.description}
                      </p>
                      <div className="grid gap-3 mb-8">
                        {feature.benefits.map((benefit) => (
                          <div
                            key={benefit}
                            className="flex items-center gap-3"
                          >
                            <IconCheck className="size-5 text-primary shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                      <Button asChild>
                        <Link href="/contact">Tìm hiểu thêm</Link>
                      </Button>
                    </div>
                    <div className={isReverse ? "lg:order-1" : ""}>
                      <Card className="overflow-hidden shadow-lg">
                        <CardContent className="p-0">
                          <Image
                            src={feature.image}
                            alt={feature.title}
                            width={600}
                            height={400}
                            className="w-full h-auto"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-3xl font-bold">
                Sẵn sàng trải nghiệm QOS Scanorderly?
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                Tham gia cùng 500+ nhà hàng đã tin tưởng và đạt được thành công
                với giải pháp của chúng tôi.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <DemoDialog>
                  <Button size="lg">Xem demo miễn phí</Button>
                </DemoDialog>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">Liên hệ tư vấn</Link>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="size-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-background"
                      />
                    ))}
                  </div>
                  <span>500+ nhà hàng tin dùng</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <IconStar
                      key={i}
                      className="size-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="ml-1">4.9/5 đánh giá</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
