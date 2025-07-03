"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { setSessionTokenToLocalStorage } from "@/lib/utils";

// Helper function to set token in both localStorage and cookies
function setTokenToBothStorages(token: string) {
  // Set to localStorage
  setSessionTokenToLocalStorage(token);
  
  // Set to cookies for middleware
  document.cookie = `sessionToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

export default function OAuthGoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionToken = searchParams.get("sessionToken");
    const errorMessage = searchParams.get("errorMessage");

    console.log('OAuth Callback - sessionToken:', sessionToken);
    console.log('OAuth Callback - errorMessage:', errorMessage);

    if (sessionToken) {
      // Store token in both localStorage and cookies
      setTokenToBothStorages(sessionToken);
      toast.success("Đăng nhập Google thành công!");

      // Decode token to get user role
      try {
        const payload = JSON.parse(atob(sessionToken.split(".")[1]));
        console.log('Token payload:', payload);
        
        // Force page refresh to trigger middleware with new cookie
        if (payload.roleName === "ADMIN_SYSTEM") {
          window.location.href = "/manage/dashboard";
        } else {
          window.location.href = "/customer/dashboard";
        }
      } catch (error) {
        console.error('Token decode error:', error);
        // Fallback to customer dashboard
        window.location.href = "/customer/dashboard";
      }
    } else if (errorMessage) {
      // Show error and redirect to login
      console.error('OAuth Error:', decodeURIComponent(errorMessage));
      toast.error(decodeURIComponent(errorMessage));
      router.push("/login");
    } else {
      // No token or error - redirect to login
      console.warn('OAuth Callback - No token or error message found');
      toast.error("Có lỗi xảy ra trong quá trình đăng nhập");
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <IconLoader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <h2 className="text-lg font-semibold mb-2">Đang xử lý đăng nhập</h2>
        <p className="text-sm text-muted-foreground">
          Vui lòng đợi trong giây lát...
        </p>
      </div>
    </div>
  );
}
