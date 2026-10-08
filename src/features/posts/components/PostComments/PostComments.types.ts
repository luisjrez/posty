import type { Comment } from '../../model';

export type PostCommentsState =
  | { status: 'loading' }
  | { status: 'error'; onRetry: () => void }
  | { status: 'ready'; comments: readonly Comment[] };

export type PostCommentsProps = {
  state: PostCommentsState;
};
