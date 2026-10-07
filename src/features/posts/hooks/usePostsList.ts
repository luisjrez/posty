import { keepPreviousData, useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';

import type { Paginated } from '@/shared/api';

import { postsListOptions } from '../api/posts.queries';
import type { Post } from '../model';

export type PostsList = { posts: Post[]; total: number };

function selectPostsList(data: InfiniteData<Paginated<Post>, number>): PostsList {
  return {
    posts: data.pages.flatMap((page) => page.items),
    total: data.pages.at(-1)?.total ?? 0,
  };
}

export function usePostsList(search = '') {
  return useInfiniteQuery({
    ...postsListOptions(search),
    select: selectPostsList,
    placeholderData: keepPreviousData,
  });
}
