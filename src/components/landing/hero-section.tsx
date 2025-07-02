"use client";

import { IconArrowRight, IconShareplay, IconStar } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

import { DemoDialog } from "@/components/demo/demo-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import images
import dashboardDarkImage from "@/assets/dashboard-dark.png";
import dashboardImage from "@/assets/dashboard.png";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <Badge variant="outline" className="mb-8 bg-background/50">
            <IconStar className="mr-1 size-3" />
            Được tin dùng bởi 500+ nhà hàng
          </Badge>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Quản lý{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              QR Ordering System
            </span>{" "}
            một cách chuyên nghiệp
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-muted-foreground">
            Scanorderly giúp bạn quản lý tập trung tất cả hệ thống QR Ordering
            của khách hàng. Theo dõi doanh thu, quản lý đánh giá và tối ưu hóa
            hiệu suất kinh doanh.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="group">
              <Link href="/register">
                Bắt đầu miễn phí
                <IconArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/plans">
                Xem giá
              </Link>
            </Button>
            <DemoDialog>
              <Button variant="ghost" size="lg" className="group">
                <IconShareplay className="mr-2 size-4" />
                Xem demo
              </Button>
            </DemoDialog>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="size-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-background"
                  />
                ))}
              </div>
              <span>500+ nhà hàng</span>
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

        {/* Hero Image/Dashboard Preview */}
        <div className="mx-auto mt-20 max-w-5xl">
          {/* Dashboard Preview */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">
                Dashboard quản lý chuyên nghiệp
              </h2>
              <p className="text-muted-foreground">
                Giao diện quản lý trực quan và dễ sử dụng
              </p>
            </div>
            <Card className="overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                  {/* Light mode dashboard */}
                  <Image
                    src={dashboardImage}
                    alt="Dashboard quản lý nhà hàng - Thống kê doanh thu, hóa đơn và quản lý đơn hàng"
                    fill
                    className="object-cover dark:hidden"
                    priority
                  />
                  {/* Dark mode dashboard */}
                  <Image
                    src={dashboardDarkImage}
                    alt="Dashboard quản lý nhà hàng - Thống kê doanh thu, hóa đơn và quản lý đơn hàng (Dark Mode)"
                    fill
                    className="object-cover hidden dark:block"
                    priority
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <p className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Dashboard quản lý chuyên nghiệp
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="size-[800px] rounded-full bg-gradient-to-r from-primary/5 to-transparent blur-3xl" />
        </div>
      </div>
    </section>
  );
}
