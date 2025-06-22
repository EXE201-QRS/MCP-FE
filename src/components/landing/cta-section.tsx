"use client";

import { IconArrowRight, IconMail, IconPhone } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CTASection() {
  return (
    <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl">
            <CardContent className="p-12 text-center">
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
                Sẵn sàng bắt đầu với Scanorderly?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
                Tham gia cùng hàng trăm nhà hàng đã tin dùng Scanorderly để quản
                lý và phát triển kinh doanh của họ.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="group bg-background text-foreground hover:bg-background/90"
                >
                  <Link href="/register">
                    Dùng thử miễn phí 14 ngày
                    <IconArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="#contact">Liên hệ tư vấn</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm opacity-75 sm:flex-row">
                <div className="flex items-center gap-2">
                  <IconMail className="size-4" />
                  <span>scanorderly196@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone className="size-4" />
                  <span>0834564869</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Signals */}
        <div className="mt-16 text-center">
          <p className="mb-8 text-sm text-muted-foreground">
            Được tin dùng bởi các thương hiệu hàng đầu
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex h-12 w-24 items-center justify-center rounded-lg bg-muted/50 text-xs font-medium text-muted-foreground"
              >
                Brand {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
