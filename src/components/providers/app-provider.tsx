"use client";

import { useAuthSync } from "@/hooks/useAuthSync";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

// Component để sync auth state sau khi login/register
function AuthSyncWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthSync();
  return <>{children}</>;
}

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthSyncWrapper>{children}</AuthSyncWrapper>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
