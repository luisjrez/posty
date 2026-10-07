import { infiniteQueryOptions } from '@tanstack/react-query';

import { getNextPageParam } from '@/shared/api';

import { postsApi } from './posts.api';

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (search: string) => [...postKeys.lists(), { search }] as const,
};

export function postsListOptions(search: string) {
  return infiniteQueryOptions({
    queryKey: postKeys.list(search),
    queryFn: ({ pageParam, signal }) => postsApi.list({ page: pageParam, search, signal }),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, pages, lastPageParam) => getNextPageParam(pages, lastPageParam),
  });
}
