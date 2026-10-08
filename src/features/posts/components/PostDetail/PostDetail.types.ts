import type { Comment, Post } from '../../model';

export type PostDetailState =
  | { status: 'loading' }
  | { status: 'notFound' }
  | { status: 'error'; onRetry: () => void }
  | {
      status: 'ready';
      post: Post;
      /** Undefined only for an offline copy that was saved without its Comments. */
      comments: readonly Comment[] | undefined;
      /** Set when the content comes from a saved copy because the device is offline. */
      offlineUpdatedAt?: number | undefined;
    };

export type PostDetailProps = {
  state: PostDetailState;
};
