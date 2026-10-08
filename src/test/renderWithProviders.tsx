import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';
import type { ReactElement, ReactNode } from 'react';

type RouteComponent = () => ReactElement;

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

function TestStackLayout() {
  return <Stack />;
}

// Screens that compose header items (e.g. `Stack.SearchBar`) need a real native stack
// around them; extra routes let tests assert where the screen navigates to.
export async function renderScreenInStack(
  Screen: RouteComponent,
  routes: Record<string, RouteComponent> = {},
) {
  const queryClient = createTestQueryClient();
  const result = await renderRouter(
    { _layout: TestStackLayout, index: Screen, ...routes },
    { initialUrl: '/', wrapper: createWrapper(queryClient) },
  );
  return { ...result, queryClient };
}
