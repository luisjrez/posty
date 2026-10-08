// The list shows a single message in place of its rows; which one depends on the query.
export type ListPlaceholder = 'loading' | 'error' | 'noResults' | 'none';

// Whatever sits under the last row: the next page loading, its failure, or the end.
export type ListFooter = 'loadingMore' | 'loadMoreError' | 'end' | 'none';

type PlaceholderInput = { isPending: boolean; isError: boolean; postCount: number };

export function listPlaceholder({
  isPending,
  isError,
  postCount,
}: PlaceholderInput): ListPlaceholder {
  if (postCount > 0) return 'none';
  if (isPending) return 'loading';
  if (isError) return 'error';
  return 'noResults';
}

type FooterInput = {
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  hasNextPage: boolean;
  postCount: number;
};

export function listFooter({
  isFetchingNextPage,
  isFetchNextPageError,
  hasNextPage,
  postCount,
}: FooterInput): ListFooter {
  if (isFetchingNextPage) return 'loadingMore';
  if (isFetchNextPageError) return 'loadMoreError';
  if (!hasNextPage && postCount > 0) return 'end';
  return 'none';
}
