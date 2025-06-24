"use client";

import { useAuthSync } from "@/hooks/useAuthSync";
import { useAuthStore } from "@/stores/auth.store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

// Component để initialize auth state
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuthStore();
  const { isLoading } = useAuthSync();

  useEffect(() => {
    // Initialize auth state khi app load
    initialize();
  }, []);

  return <>{children}</>;
}

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>{children}</AuthInitializer>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
