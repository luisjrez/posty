import type { Paginated } from './request';

export function getNextPageParam<T>(
  pages: Paginated<T>[],
  lastPageParam: number,
): number | undefined {
  const lastPage = pages.at(-1);
  if (!lastPage || lastPage.items.length === 0) return undefined;
  const loaded = pages.reduce((count, page) => count + page.items.length, 0);
  return loaded < lastPage.total ? lastPageParam + 1 : undefined;
}
