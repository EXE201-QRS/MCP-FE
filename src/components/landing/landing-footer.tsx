"use client";

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  product: [
    { name: "Tính năng", href: "#features" },
    { name: "Bảng giá", href: "#pricing" },
    { name: "Đánh giá", href: "#testimonials" },
    { name: "Demo", href: "#demo" },
  ],
  support: [
    { name: "Trung tâm hỗ trợ", href: "/support" },
    { name: "Tài liệu API", href: "/docs" },
    { name: "Hướng dẫn", href: "/guides" },
    { name: "Liên hệ", href: "/contact" },
  ],
  company: [
    { name: "Về chúng tôi", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Tuyển dụng", href: "/careers" },
    { name: "Đối tác", href: "/partners" },
  ],
  legal: [
    { name: "Điều khoản sử dụng", href: "/terms" },
    { name: "Chính sách bảo mật", href: "/privacy" },
    { name: "Chính sách cookie", href: "/cookies" },
    { name: "GDPR", href: "/gdpr" },
  ],
};

const socialLinks = [
  { name: "GitHub", href: "#", icon: IconBrandGithub },
  { name: "Twitter", href: "#", icon: IconBrandTwitter },
  { name: "LinkedIn", href: "#", icon: IconBrandLinkedin },
];

export function LandingFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Brand & Contact */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="m2 17 10 5 10-5" />
                    <path d="m2 12 10 5 10-5" />
                  </svg>
                </div>
                <span className="text-xl font-bold">MCP-QOS</span>
              </Link>

              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                Hệ thống quản lý QR Ordering System chuyên nghiệp, giúp nhà hàng
                tối ưu hóa quy trình và tăng doanh thu.
              </p>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconMail className="size-4" />
                  <span>scanorderly196@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconPhone className="size-4" />
                  <span>0834564869</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconMapPin className="size-4" />
                  <span>Thủ Đức, TP. Hồ Chí Minh</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Button
                      key={social.name}
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <Link href={social.href}>
                        <IconComponent className="size-4" />
                        <span className="sr-only">{social.name}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold">Sản phẩm</h3>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold">Hỗ trợ</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold">Công ty</h3>
              <ul className="space-y-2 mb-6">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="mb-4 text-sm font-semibold">Pháp lý</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        <div className="py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 MCP-QOS. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Proudly made in Vietnam 🇻🇳</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
