import type { ReactNode } from 'react';

import type { Post } from '../../model';
import type { PostListFooterState } from '../PostListFooter';

// One status instead of several booleans, so impossible combinations (loading with an error,
// an error with Posts) can't be expressed. Paging and refresh only exist once Posts are ready.
export type PostListState =
  | { status: 'loading' }
  | { status: 'error'; onRetry: () => void }
  | {
      status: 'ready';
      posts: readonly Post[];
      footer: PostListFooterState;
      onEndReached: () => void;
      isRefreshing: boolean;
      onRefresh: () => void;
    };

export type PostListProps = {
  state: PostListState;
  /** Shown when the list is ready but empty; the controller knows why it's empty. */
  emptyMessage: string;
  onPressPost: (post: Post) => void;
  /** Lets the screen add per-card controls without the list knowing what they are. */
  renderAccessory?: (post: Post) => ReactNode;
};
