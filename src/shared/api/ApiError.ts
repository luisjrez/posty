import { AxiosError, isAxiosError } from 'axios';

export type ApiErrorKind = 'network' | 'timeout' | 'http' | 'parse';

export class ApiError extends Error {
  override readonly name = 'ApiError';
  readonly kind: ApiErrorKind;
  readonly status: number | undefined;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.kind = kind;
    this.status = status;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isNotFoundError(error: unknown): boolean {
  return isApiError(error) && error.kind === 'http' && error.status === 404;
}

const TIMEOUT_CODES = new Set<string | undefined>([AxiosError.ECONNABORTED, AxiosError.ETIMEDOUT]);

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;
  if (!isAxiosError(error)) return new ApiError('network', String(error));
  if (TIMEOUT_CODES.has(error.code)) return new ApiError('timeout', 'The request timed out');
  if (error.response) {
    const { status } = error.response;
    return new ApiError('http', `Request failed with status ${status}`, status);
  }
  return new ApiError('network', error.message);
}
