"use client";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthPageLayout({
  children,
  title,
  subtitle,
}: AuthPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <LandingHeader />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4 py-16">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="size-[600px] rounded-full bg-gradient-to-r from-primary/5 to-transparent blur-3xl" />
          </div>
        </div>

        <div className="w-full max-w-md">
          {/* Auth card */}
          <Card className="shadow-xl border-border/50">
            <CardHeader className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
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
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
