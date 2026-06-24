import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Query Client
// ---------------------------------------------------------------------------

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /** Data is fresh for 5 minutes before a background refetch is triggered */
      staleTime: 5 * 60 * 1000,
      /** Inactive data is garbage-collected after 30 minutes */
      gcTime: 30 * 60 * 1000,
      /** Retry failed requests once before surfacing an error */
      retry: 1,
      /** Avoid noisy refetches every time the user switches tabs */
      refetchOnWindowFocus: false,
    },
  },
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
