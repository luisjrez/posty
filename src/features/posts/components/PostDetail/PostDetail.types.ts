import type { PostDetail } from '../../model';

export type PostDetailState =
  | { status: 'loading' }
  | { status: 'notFound' }
  | { status: 'error'; onRetry: () => void }
  | { status: 'ready'; detail: PostDetail };

export type PostDetailProps = {
  state: PostDetailState;
};
