import { z } from 'zod';

import { ApiError } from './ApiError';
import { httpClient } from './httpClient';

type ParamValue = string | number;
// Arrays are sent as repeated keys (`id=1&id=2`), which is what json-server expects.
type QueryParams = Record<string, ParamValue | readonly ParamValue[]>;

export type RequestConfig = {
  url: string;
  params?: QueryParams | undefined;
  signal?: AbortSignal | undefined;
};

export type Paginated<T> = { items: T[]; total: number };

const TotalCountSchema = z.coerce.number().int().nonnegative();

function parse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError('parse', `Unexpected response shape:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

function send({ url, params, signal }: RequestConfig) {
  return httpClient.request<unknown>({
    url,
    params,
    ...(signal ? { signal } : {}),
  });
}

export async function request<T>(schema: z.ZodType<T>, config: RequestConfig): Promise<T> {
  const response = await send(config);
  return parse(schema, response.data);
}

export async function requestPaginated<T>(
  itemSchema: z.ZodType<T>,
  config: RequestConfig,
): Promise<Paginated<T>> {
  const response = await send(config);
  return {
    items: parse(z.array(itemSchema), response.data),
    total: parse(TotalCountSchema, response.headers['x-total-count']),
  };
}
