import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook } from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';

function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

export async function renderWithProviders(ui: ReactElement) {
  const queryClient = createTestQueryClient();
  const result = await render(ui, { wrapper: createWrapper(queryClient) });
  return { ...result, queryClient };
}

export async function renderHookWithProviders<Result>(hook: () => Result) {
  const queryClient = createTestQueryClient();
  const result = await renderHook(hook, { wrapper: createWrapper(queryClient) });
  return { ...result, queryClient };
}
