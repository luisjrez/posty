import type { Post } from '../../model';
import type { PostCommentsState } from '../PostComments';

// The Post can be ready (from the list cache) while its Comments are still loading or failed.
export type PostDetailState =
  | { status: 'loading' }
  | { status: 'notFound' }
  | { status: 'error'; onRetry: () => void }
  | { status: 'ready'; post: Post; comments: PostCommentsState };

export type PostDetailProps = {
  state: PostDetailState;
};
