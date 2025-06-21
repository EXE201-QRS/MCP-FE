"use client";

import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconHeadphones,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSend,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Cảm ơn bạn! Chúng tôi sẽ liên hệ lại trong 24h.");
    setIsSubmitting(false);
  };

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
              <span className="text-foreground">Liên hệ</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="outline" className="mb-8">
                Liên hệ tư vấn
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Sẵn sàng tư vấn{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  miễn phí
                </span>{" "}
                cho bạn
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn tìm
                hiểu và triển khai giải pháp QR Ordering System phù hợp nhất.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Gửi yêu cầu tư vấn
                    </CardTitle>
                    <CardDescription>
                      Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại trong
                      24h
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Họ và tên *</Label>
                          <Input
                            id="name"
                            placeholder="Nguyễn Văn A"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Số điện thoại *</Label>
                          <Input id="phone" placeholder="0834564869" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="contact@restaurant.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="restaurant">Tên nhà hàng</Label>
                        <Input id="restaurant" placeholder="Nhà hàng ABC" />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="restaurant-type">
                            Loại hình kinh doanh
                          </Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại hình" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fastfood">
                                Fast Food
                              </SelectItem>
                              <SelectItem value="casual">
                                Casual Dining
                              </SelectItem>
                              <SelectItem value="fine">Fine Dining</SelectItem>
                              <SelectItem value="cafe">Café</SelectItem>
                              <SelectItem value="bar">Bar/Pub</SelectItem>
                              <SelectItem value="buffet">Buffet</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="restaurant-size">
                            Quy mô nhà hàng
                          </Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn quy mô" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">
                                Nhỏ (&lt; 20 bàn)
                              </SelectItem>
                              <SelectItem value="medium">
                                Vừa (20-50 bàn)
                              </SelectItem>
                              <SelectItem value="large">
                                Lớn ({">"} 50 bàn)
                              </SelectItem>
                              <SelectItem value="chain">
                                Chuỗi nhà hàng
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="plan">Gói dịch vụ quan tâm</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn gói dịch vụ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">
                              Basic - 299,000đ/tháng
                            </SelectItem>
                            <SelectItem value="professional">
                              Professional - 599,000đ/tháng
                            </SelectItem>
                            <SelectItem value="enterprise">
                              Enterprise - 1,299,000đ/tháng
                            </SelectItem>
                            <SelectItem value="custom">
                              Tùy chỉnh theo nhu cầu
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Tin nhắn</Label>
                        <Textarea
                          id="message"
                          placeholder="Mô tả chi tiết nhu cầu của bạn, câu hỏi hoặc yêu cầu đặc biệt..."
                          rows={4}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Đang gửi..."
                        ) : (
                          <>
                            <IconSend className="mr-2 size-4" />
                            Gửi yêu cầu tư vấn
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                {/* Contact Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Thông tin liên hệ</CardTitle>
                    <CardDescription>
                      Liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconMail className="size-6" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <a
                          href="mailto:scanorderly196@gmail.com"
                          className="text-muted-foreground hover:text-primary"
                        >
                          scanorderly196@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconPhone className="size-6" />
                      </div>
                      <div>
                        <p className="font-medium">Số điện thoại</p>
                        <a
                          href="tel:0834564869"
                          className="text-muted-foreground hover:text-primary"
                        >
                          0834 564 869
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconMapPin className="size-6" />
                      </div>
                      <div>
                        <p className="font-medium">Địa chỉ</p>
                        <p className="text-muted-foreground">
                          Hồ Chí Minh, Việt Nam
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconClock className="size-6" />
                      </div>
                      <div>
                        <p className="font-medium">Giờ làm việc</p>
                        <p className="text-muted-foreground">
                          T2 - T6: 8:00 - 18:00
                          <br />
                          T7: 8:00 - 12:00
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 mx-auto mb-4">
                        <IconCalendar className="size-6" />
                      </div>
                      <h3 className="font-medium mb-2">Đặt lịch Demo</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Xem demo trực tiếp 1:1 với chuyên gia
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Đặt lịch ngay
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 mx-auto mb-4">
                        <IconHeadphones className="size-6" />
                      </div>
                      <h3 className="font-medium mb-2">Hỗ trợ Live Chat</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Chat trực tiếp với đội ngũ support
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Bắt đầu chat
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* FAQ Quick Links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Câu hỏi thường gặp
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link
                      href="/faq#pricing"
                      className="block text-sm text-muted-foreground hover:text-primary"
                    >
                      → Chi phí triển khai và vận hành như thế nào?
                    </Link>
                    <Link
                      href="/faq#implementation"
                      className="block text-sm text-muted-foreground hover:text-primary"
                    >
                      → Thời gian triển khai mất bao lâu?
                    </Link>
                    <Link
                      href="/faq#training"
                      className="block text-sm text-muted-foreground hover:text-primary"
                    >
                      → Có được đào tạo sử dụng hệ thống không?
                    </Link>
                    <Link
                      href="/faq#support"
                      className="block text-sm text-muted-foreground hover:text-primary"
                    >
                      → Chính sách hỗ trợ sau triển khai?
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
