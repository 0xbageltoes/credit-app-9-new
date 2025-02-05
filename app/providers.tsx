'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Provider as JotaiProvider } from 'jotai';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </JotaiProvider>
      </QueryClientProvider>
      <Toaster />
    </div>
  );
}