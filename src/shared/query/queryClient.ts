import { QueryClient } from '@tanstack/react-query';

import { isApiError } from '@/shared/api';

const MAX_RETRIES = 2;

export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) return false;
  if (!isApiError(error)) return true;
  if (error.kind === 'parse') return false;
  const isClientError = error.status !== undefined && error.status >= 400 && error.status < 500;
  return !(error.kind === 'http' && isClientError);
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 5 * 60_000, retry: shouldRetry },
    },
  });
}
