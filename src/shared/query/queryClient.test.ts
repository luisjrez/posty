import { ApiError } from '@/shared/api';

import { shouldRetry } from './queryClient';

describe('shouldRetry', () => {
  it('retries transient failures up to twice', () => {
    const error = new ApiError('network', 'offline');

    expect(shouldRetry(0, error)).toBe(true);
    expect(shouldRetry(1, error)).toBe(true);
    expect(shouldRetry(2, error)).toBe(false);
  });

  it('retries server errors and timeouts', () => {
    expect(shouldRetry(0, new ApiError('http', 'boom', 500))).toBe(true);
    expect(shouldRetry(0, new ApiError('timeout', 'slow'))).toBe(true);
  });

  it('never retries client errors or schema mismatches', () => {
    expect(shouldRetry(0, new ApiError('http', 'missing', 404))).toBe(false);
    expect(shouldRetry(0, new ApiError('parse', 'bad shape'))).toBe(false);
  });
});
