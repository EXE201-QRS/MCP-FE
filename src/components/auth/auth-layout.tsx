"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="size-[600px] rounded-full bg-gradient-to-r from-primary/5 to-transparent blur-3xl" />
        </div>
      </div>

      <div className="w-full max-w-md">
        {/* Back to home button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/" className="inline-flex items-center gap-2">
              <IconArrowLeft className="size-4" />
              Về trang chủ
            </Link>
          </Button>
        </div>

        {/* Auth card */}
        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">
                Q
              </span>
            </div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">{children}</CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          © 2025 Scanorderly. Được phát triển với ❤️ cho ngành F&B Việt Nam.
        </div>
      </div>
    </div>
  );
}
