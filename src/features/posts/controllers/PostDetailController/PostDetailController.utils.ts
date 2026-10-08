import type { FavoriteSnapshot, SnapshotInput } from '@/features/favorites';

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
  isOnline: boolean;
  /** When `detail` was fetched; offline it dates the notice. */
  fetchedAt: number;
  /** The Favorite's saved copy, if this Post is one. */
  savedCopy: FavoriteSnapshot | undefined;
  onRetry: () => void;
};

// Fetched data wins, even a stale cache entry after a failed refetch. Offline, a Favorite falls
// back to its saved copy (that is what saving is for); anything else can't load until the
// connection returns, which reads as an error rather than an endless skeleton. A 404 is final.
export function detailState({
  detail,
  isNotFound,
  isError,
  isOnline,
  fetchedAt,
  savedCopy,
  onRetry,
}: DetailInput): PostDetailState {
  if (isNotFound) return { status: 'notFound' };
  if (detail) {
    const { comments, ...post } = detail;
    // Offline, even freshly cached data can't be refreshed, so it is flagged like a saved copy.
    return isOnline
      ? { status: 'ready', post, comments }
      : { status: 'ready', post, comments, offlineUpdatedAt: fetchedAt };
  }
  if (!isOnline && savedCopy) {
    return {
      status: 'ready',
      post: savedCopy.post,
      comments: savedCopy.comments,
      offlineUpdatedAt: savedCopy.syncedAt,
    };
  }
  if (isError || !isOnline) return { status: 'error', onRetry };
  return { status: 'loading' };
}

// Favorites store the Post and its Comments apart; the detail response nests them.
export function toSnapshotInput({ comments, ...post }: PostDetail): SnapshotInput {
  return { post, comments };
}
