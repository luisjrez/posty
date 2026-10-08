import {
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query';
import { useCallback } from 'react';

import { isNotFoundError, type Paginated } from '@/shared/api';

import { postDetailOptions, postKeys } from '../api/posts.queries';
import type { Post, PostDetail, PostId } from '../model';

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
  const placeholderData = useCallback((): PostDetail | undefined => {
    if (id === null) return undefined;
    const post = findListedPost(queryClient, id);
    // The list has no Comments; isPlaceholderData tells the screen they're still loading.
    return post && { ...post, comments: [] };
  }, [queryClient, id]);
  const query = useQuery({ ...postDetailOptions(id), placeholderData });

  return {
    // A failed fetch drops the placeholder; keep the listed Post up so only Comments show the error.
    post: query.data ?? (query.isError ? placeholderData() : undefined),
    comments: query.isPlaceholderData ? undefined : query.data?.comments,
    isNotFound: id === null || isNotFoundError(query.error),
    isError: query.isError,
    refetch: query.refetch,
  };
}
