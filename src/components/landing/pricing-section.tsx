"use client"

import Link from "next/link"
import { IconCheck, IconStar } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Basic",
    price: "299,000",
    duration: "tháng",
    description: "Phù hợp cho nhà hàng nhỏ, quán ăn gia đình",
    popular: false,
    features: [
      "Tối đa 10 bàn",
      "5 nhân viên sử dụng",
      "Dashboard cơ bản",
      "Thanh toán online",
      "Hỗ trợ email",
      "Backup hàng ngày",
    ],
    limitations: [
      "Không có analytics nâng cao",
      "Không custom branding",
    ],
  },
  {
    name: "Professional", 
    price: "599,000",
    duration: "tháng",
    description: "Dành cho nhà hàng vừa, chuỗi nhỏ",
    popular: true,
    features: [
      "Tối đa 30 bàn", 
      "15 nhân viên sử dụng",
      "Dashboard nâng cao",
      "Analytics chi tiết",
      "Custom branding",
      "Thanh toán online",
      "Hỗ trợ ưu tiên",
      "Backup real-time",
      "API access",
    ],
    limitations: [],
  },
  {
    name: "Enterprise",
    price: "1,299,000", 
    duration: "tháng",
    description: "Cho chuỗi nhà hàng lớn, enterprise",
    popular: false,
    features: [
      "Không giới hạn bàn",
      "Không giới hạn nhân viên", 
      "Dashboard enterprise",
      "Advanced analytics",
      "White-label solution",
      "Multi-location support",
      "Dedicated support",
      "Custom integrations",
      "SLA đảm bảo",
    ],
    limitations: [],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-8">
            Bảng giá
          </Badge>
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Chọn gói phù hợp với nhu cầu
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-lg text-muted-foreground">
            Bắt đầu miễn phí 14 ngày. Không cần thẻ tín dụng. 
            Hủy bất cứ lúc nào.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${
                plan.popular 
                  ? "border-primary ring-2 ring-primary/10 shadow-lg scale-105" 
                  : "border-border/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <IconStar className="mr-1 size-3" />
                    Phổ biến nhất
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    {plan.price}
                    <span className="text-lg font-normal text-muted-foreground">
                      đ/{plan.duration}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex flex-col gap-2">
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/register">
                      Bắt đầu miễn phí
                    </Link>
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link href="/plans">
                      Xem tất cả gói
                    </Link>
                  </Button>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Tính năng bao gồm:</p>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <IconCheck className="size-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground">
                      Hạn chế:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="size-4 rounded-full border border-muted-foreground/30 shrink-0" />
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="mb-8 text-2xl font-bold">Câu hỏi thường gặp</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="text-left">
              <h4 className="mb-2 font-medium">Có thể hủy gói dịch vụ bất cứ lúc nào?</h4>
              <p className="text-sm text-muted-foreground">
                Có, bạn có thể hủy gói dịch vụ bất cứ lúc nào. Không có phí hủy.
              </p>
            </div>
            <div className="text-left">
              <h4 className="mb-2 font-medium">Có hỗ trợ migrate dữ liệu không?</h4>
              <p className="text-sm text-muted-foreground">
                Có, chúng tôi hỗ trợ migrate dữ liệu miễn phí cho tất cả gói dịch vụ.
              </p>
            </div>
            <div className="text-left">
              <h4 className="mb-2 font-medium">Có thể nâng cấp/hạ cấp gói không?</h4>
              <p className="text-sm text-muted-foreground">
                Có, bạn có thể thay đổi gói dịch vụ bất cứ lúc nào từ dashboard.
              </p>
            </div>
            <div className="text-left">
              <h4 className="mb-2 font-medium">Phương thức thanh toán nào được hỗ trợ?</h4>
              <p className="text-sm text-muted-foreground">
                Chúng tôi hỗ trợ thẻ tín dụng, chuyển khoản ngân hàng và ví điện tử.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
