import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { z } from 'zod';

import { isNotFoundError } from '@/shared/api';

import { postDetailOptions, postKeys } from '../api/posts.queries';
import { PostSchema, type Post, type PostDetail, type PostId } from '../model';

// The query cache is untyped storage: a type argument on getQueriesData would only assert
// the shape. Parsing proves it, and skips any entry that doesn't hold list pages.
const ListCacheSchema = z.object({
  pages: z.array(z.object({ items: z.array(PostSchema) })),
});

// Any list page (whatever its search) that already holds the Post can paint the detail
// while its Comments load.
function findListedPost(queryClient: QueryClient, id: PostId): Post | undefined {
  for (const [, data] of queryClient.getQueriesData({ queryKey: postKeys.lists() })) {
    const parsed = ListCacheSchema.safeParse(data);
    if (!parsed.success) continue;
    const post = parsed.data.pages.flatMap((page) => page.items).find((item) => item.id === id);
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
