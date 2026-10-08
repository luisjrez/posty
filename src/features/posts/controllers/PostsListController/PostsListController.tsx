import { router, Stack } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { searchBarOptions } from '@/design-system';
import { FavoriteToggle, useSyncFavoriteSnapshots } from '@/features/favorites';
import { useDebouncedValue } from '@/shared/lib';

import { PostList, type PostListState } from '../../components/PostList';
import { usePostsList } from '../../hooks/usePostsList';
import type { Post } from '../../model';

import type { PostsListControllerProps } from './PostsListController.types';
import { emptyMessage, footerState } from './PostsListController.utils';

// Long enough to skip intermediate keystrokes, short enough to feel live.
const SEARCH_DEBOUNCE_MS = 300;

function openPost(post: Post) {
  router.push(`/posts/${post.id}`);
}

function renderFavoriteToggle(post: Post) {
  return <FavoriteToggle post={post} />;
}

// Owns everything stateful about the Posts tab (search text, the infinite query, pull to
// refresh, navigation) and hands PostList plain data; PostList never fetches.
export function PostsListController(_props: PostsListControllerProps) {
  const { theme } = useUnistyles();
  const [search, setSearch] = useState('');
  // Whitespace alone is not a search, and trimming keeps " foo" and "foo" on one cache entry.
  const term = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const {
    data,
    isError,
    isPlaceholderData,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePostsList(term);

  const snapshots = useMemo(() => data?.posts.map((post) => ({ post })), [data]);
  useSyncFavoriteSnapshots(snapshots);

  const searchBar = useMemo(() => searchBarOptions(theme, 'Search posts'), [theme]);

  const handleChangeText = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => setSearch(event.nativeEvent.text),
    [],
  );

  // Cancelling doesn't always emit an empty change, so reset explicitly to restore the full list.
  const handleCancel = useCallback(() => setSearch(''), []);

  const handleRetry = useCallback(() => void refetch(), [refetch]);

  const handleLoadMore = useCallback(() => void fetchNextPage(), [fetchNextPage]);

  const handleEndReached = useCallback(() => {
    // While the previous search's results stand in for the new one, paging would append
    // pages of the old term; a failed page waits for an explicit retry.
    if (!hasNextPage || isFetchingNextPage || isFetchNextPageError || isPlaceholderData) return;
    void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, isPlaceholderData, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    // Tracked locally so background refetches (focus, reconnect) don't show the spinner.
    setIsPullRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsPullRefreshing(false);
    }
  }, [refetch]);

  let state: PostListState;
  if (data) {
    state = {
      status: 'ready',
      posts: data.posts,
      footer: footerState({
        isFetchingNextPage,
        isFetchNextPageError,
        hasNextPage,
        postCount: data.posts.length,
        onRetry: handleLoadMore,
      }),
      onEndReached: handleEndReached,
      isRefreshing: isPullRefreshing,
      onRefresh: handleRefresh,
    };
  } else if (isError) {
    state = { status: 'error', onRetry: handleRetry };
  } else {
    state = { status: 'loading' };
  }

  return (
    <>
      <Stack.SearchBar
        {...searchBar}
        onChangeText={handleChangeText}
        onCancelButtonPress={handleCancel}
      />
      <PostList
        state={state}
        emptyMessage={emptyMessage(term)}
        onPressPost={openPost}
        renderAccessory={renderFavoriteToggle}
      />
    </>
  );
}
