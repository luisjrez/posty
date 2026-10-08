import { infiniteQueryOptions, queryOptions, skipToken } from '@tanstack/react-query';

import { getNextPageParam } from '@/shared/api';

import type { PostId } from '../model';

import { postsApi } from './posts.api';

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (search: string) => [...postKeys.lists(), { search }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: PostId | null) => [...postKeys.details(), id] as const,
};

export function postsListOptions(search: string) {
  return infiniteQueryOptions({
    queryKey: postKeys.list(search),
    queryFn: ({ pageParam, signal }) => postsApi.list({ page: pageParam, search, signal }),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, pages, lastPageParam) => getNextPageParam(pages, lastPageParam),
  });
}

// A null id (an unparseable route param) never reaches the network.
export function postDetailOptions(id: PostId | null) {
  return queryOptions({
    queryKey: postKeys.detail(id),
    queryFn: id === null ? skipToken : ({ signal }) => postsApi.detail({ id, signal }),
  });
}
