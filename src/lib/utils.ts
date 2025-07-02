import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast.error(error?.payload?.message ?? "Lỗi không xác định", {
      duration: duration ?? 5000,
    });
  }
};

const isBrowser = typeof window !== "undefined";

export const getSessionTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("sessionToken") : null;

export const setSessionTokenToLocalStorage = (value: string) => {
  if (isBrowser) {
    localStorage.setItem("sessionToken", value);
  }
};

export const removeTokensFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem("sessionToken");
  }
};

// ===== FORMATTING UTILITIES =====
export const formatCurrency = (amount: number, currency: string = 'VND'): string => {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num)
}

export const formatPercentage = (num: number, decimals: number = 1): string => {
  return `${num.toFixed(decimals)}%`
}

export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export const formatDate = (date: string | Date, format: 'short' | 'long' | 'datetime' = 'short'): string => {
  const d = new Date(date)
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('vi-VN')
    case 'long':
      return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    case 'datetime':
      return d.toLocaleString('vi-VN')
    default:
      return d.toLocaleDateString('vi-VN')
  }
}
