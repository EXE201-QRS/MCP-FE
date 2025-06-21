"use client";

import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Sản phẩm", href: "/product" },
  { name: "Tính năng", href: "#features" },
  { name: "Bảng giá", href: "#pricing" },
  { name: "Blog", href: "/blog" },
  { name: "Liên hệ", href: "/contact" },
];

export function LandingHeader() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
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
              <span className="hidden font-bold sm:inline-block">
                Scanorderly
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Bắt đầu ngay</Link>
            </Button>
            <ModeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IconMenu2 className="size-5" />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex items-center justify-between">
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
                    <span className="font-bold">Scanorderly</span>
                  </Link>
                </div>
                <nav className="mt-8 flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="mt-8 flex flex-col space-y-4">
                    <ModeToggle />
                    <Button variant="ghost" asChild>
                      <Link href="/login">Đăng nhập</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">Bắt đầu ngay</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
