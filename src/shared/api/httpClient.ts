import { create, isCancel } from 'axios';

import { env } from '@/config';

import { toApiError } from './ApiError';

export const httpClient = create({
  baseURL: env.apiUrl,
  timeout: 10_000,
});

httpClient.interceptors.response.use(undefined, (error: unknown) =>
  Promise.reject(isCancel(error) ? error : toApiError(error)),
);

export function enableRequestLogging(): void {
  httpClient.interceptors.request.use((config) => {
    console.log(`→ ${config.method?.toUpperCase()} ${config.url}`, config.params ?? '');
    return config;
  });
}
