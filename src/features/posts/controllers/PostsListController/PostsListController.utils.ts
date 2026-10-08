import type { PostListFooterState } from '../../components/PostListFooter';

type FooterInput = {
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  hasNextPage: boolean;
  postCount: number;
  onRetry: () => void;
};

export function footerState({
  isFetchingNextPage,
  isFetchNextPageError,
  hasNextPage,
  postCount,
  onRetry,
}: FooterInput): PostListFooterState {
  if (isFetchingNextPage) return { status: 'loadingMore' };
  if (isFetchNextPageError) return { status: 'loadMoreFailed', onRetry };
  if (!hasNextPage && postCount > 0) return { status: 'end' };
  return { status: 'idle' };
}

export function emptyMessage(search: string): string {
  return search ? `No posts match "${search}"` : 'No posts yet';
}
