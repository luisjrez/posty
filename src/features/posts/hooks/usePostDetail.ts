import {
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';

import { isApiError, type Paginated } from '@/shared/api';

import { postDetailOptions, postKeys } from '../api/posts.queries';
import type { Post, PostId } from '../model';

// Any list page (whatever its search) that already holds the Post can paint the detail
// while its Comments load.
function findListedPost(queryClient: QueryClient, id: PostId): Post | undefined {
  const lists = queryClient.getQueriesData<InfiniteData<Paginated<Post>, number>>({
    queryKey: postKeys.lists(),
  });
  for (const [, data] of lists) {
    const post = data?.pages.flatMap((page) => page.items).find((item) => item.id === id);
    if (post) return post;
  }
  return undefined;
}

export function usePostDetail(id: PostId | null) {
  const queryClient = useQueryClient();
  const query = useQuery(postDetailOptions(id));
  // Read once per id: the list cache only matters until the detail itself arrives.
  const listedPost = useMemo(
    () => (id === null ? undefined : findListedPost(queryClient, id)),
    [queryClient, id],
  );

  const isNotFound =
    id === null ||
    (isApiError(query.error) && query.error.kind === 'http' && query.error.status === 404);

  return {
    post: query.data ?? listedPost,
    comments: query.data?.comments,
    isNotFound,
    isError: query.isError,
    refetch: query.refetch,
  };
}
