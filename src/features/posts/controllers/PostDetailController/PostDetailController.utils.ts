import type { SnapshotInput } from '@/features/favorites';

import type { PostDetailState } from '../../components/PostDetail';
import { PostIdParamSchema, type PostDetail, type PostId } from '../../model';

export function parsePostId(param: string | string[] | undefined): PostId | null {
  const result = PostIdParamSchema.safeParse(param);
  return result.success ? result.data : null;
}

type DetailInput = {
  detail: PostDetail | undefined;
  isNotFound: boolean;
  isError: boolean;
  onRetry: () => void;
};

// Cached data wins over a failed background refetch, so a stale Post never turns into an
// error screen. Not found is checked first: a 404 means there is nothing to keep showing.
export function detailState({
  detail,
  isNotFound,
  isError,
  onRetry,
}: DetailInput): PostDetailState {
  if (isNotFound) return { status: 'notFound' };
  if (detail) return { status: 'ready', detail };
  if (isError) return { status: 'error', onRetry };
  return { status: 'loading' };
}

// Favorites store the Post and its Comments apart; the detail response nests them.
export function toSnapshotInput({ comments, ...post }: PostDetail): SnapshotInput {
  return { post, comments };
}
