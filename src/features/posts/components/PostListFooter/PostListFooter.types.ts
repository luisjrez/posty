// What sits under the last row; one status so "loading" and "failed" can't both be set.
export type PostListFooterState =
  | { status: 'idle' }
  | { status: 'loadingMore' }
  | { status: 'loadMoreFailed'; onRetry: () => void }
  | { status: 'end' };

export type PostListFooterProps = {
  state: PostListFooterState;
};
