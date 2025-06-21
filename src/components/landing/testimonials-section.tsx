"use client"

import { IconStar, IconQuote } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const testimonials = [
  {
    name: "Nguyễn Văn A",
    role: "Chủ nhà hàng",
    restaurant: "Nhà hàng Sài Gòn",
    content: "MCP-QOS đã giúp chúng tôi quản lý hệ thống đặt món một cách hiệu quả. Dashboard rất trực quan và dễ sử dụng.",
    rating: 5,
    avatar: "NA",
  },
  {
    name: "Trần Thị B", 
    role: "Quản lý F&B",
    restaurant: "Chuỗi nhà hàng Việt",
    content: "Tính năng theo dõi doanh thu real-time rất hữu ích. Chúng tôi có thể đưa ra quyết định kinh doanh nhanh chóng.",
    rating: 5,
    avatar: "TB",
  },
  {
    name: "Lê Minh C",
    role: "Giám đốc vận hành", 
    restaurant: "Fast Food Chain",
    content: "Hệ thống thanh toán tích hợp rất an toàn và thuận tiện. Khách hàng rất hài lòng với trải nghiệm đặt món.",
    rating: 5,
    avatar: "LC",
  },
  {
    name: "Phạm Thị D",
    role: "Chủ quán café",
    restaurant: "Café Corner",
    content: "Support team rất nhiệt tình và chuyên nghiệp. Mọi vấn đề đều được giải quyết nhanh chóng.",
    rating: 5,
    avatar: "PD",
  },
  {
    name: "Hoàng Văn E",
    role: "Quản lý nhà hàng",
    restaurant: "Fine Dining Restaurant", 
    content: "Tính năng quản lý reviews giúp chúng tôi nắm bắt được feedback khách hàng và cải thiện dịch vụ liên tục.",
    rating: 5,
    avatar: "HE",
  },
  {
    name: "Đặng Thị F",
    role: "Founder",
    restaurant: "Startup F&B",
    content: "Giá cả hợp lý, tính năng đầy đủ. Đây là giải pháp tốt nhất cho các startup F&B như chúng tôi.",
    rating: 5,
    avatar: "DF",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-muted/20 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-8">
            Đánh giá khách hàng
          </Badge>
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Được tin dùng bởi hàng trăm nhà hàng
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-lg text-muted-foreground">
            Khách hàng của chúng tôi đã tăng trưởng doanh thu và cải thiện trải nghiệm 
            khách hàng đáng kể khi sử dụng MCP-QOS.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <IconStar key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <IconQuote className="size-8 text-muted-foreground/30" />
                </div>
                
                <blockquote className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
                
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} • {testimonial.restaurant}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg bg-background/50 px-4 py-2 backdrop-blur">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <IconStar key={i} className="size-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-sm">
              <span className="font-semibold">4.9/5</span> từ 500+ đánh giá
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
