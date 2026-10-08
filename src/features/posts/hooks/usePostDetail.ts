import { useQuery } from '@tanstack/react-query';

import { isNotFoundError } from '@/shared/api';

import { postDetailOptions } from '../api/posts.queries';
import type { PostId } from '../model';

export function usePostDetail(id: PostId | null) {
  const query = useQuery(postDetailOptions(id));

  return {
    detail: query.data,
    fetchedAt: query.dataUpdatedAt,
    isNotFound: id === null || isNotFoundError(query.error),
    isError: query.isError,
    refetch: query.refetch,
  };
}
