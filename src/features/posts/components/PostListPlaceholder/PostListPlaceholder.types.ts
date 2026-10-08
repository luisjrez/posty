import type { PostListState } from '../PostList';

export type PostListPlaceholderProps = {
  state: PostListState;
  emptyMessage: string;
  emptyHint?: string | undefined;
};
