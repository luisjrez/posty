import { router, Stack } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { searchBarOptions } from '@/design-system';
import { PostList, type Post, type PostListState } from '@/features/posts';
import { OfflineNotice } from '@/shared/components';
import { useIsOnline } from '@/shared/query';

import { useFavoritePosts } from '../../hooks/useFavoritePosts';
import { useFavoriteSnapshots } from '../../hooks/useFavoriteSnapshots';
import { FavoriteToggle } from '../FavoriteToggle';

import type { FavoritesListControllerProps } from './FavoritesListController.types';
import { emptyState, matchingPosts, oldestSync } from './FavoritesListController.utils';

type ReadyState = Extract<PostListState, { status: 'ready' }>;

const IDLE_FOOTER: ReadyState['footer'] = { status: 'idle' };

function openPost(post: Post) {
  // Group-qualified so the detail opens inside the Favorites tab's own stack.
  router.push(`/(favorites)/posts/${post.id}`);
}

// Favorites are one request with no pages, so reaching the end has nothing to load.
function noop() {}

// Hearts here only ever remove: every Post on this screen is already a Favorite.
function renderFavoriteToggle(post: Post) {
  return <FavoriteToggle post={post} />;
}

export function FavoritesListController(_props: FavoritesListControllerProps) {
  const { theme } = useUnistyles();
  const [search, setSearch] = useState('');
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const isOnline = useIsOnline();
  const snapshots = useFavoriteSnapshots();
  // Sorted so the query key depends on which Posts are saved, not on the order they were saved in.
  const ids = useMemo(
    () => snapshots.map((snapshot) => snapshot.post.id).sort((a, b) => a - b),
    [snapshots],
  );
  const { refetch } = useFavoritePosts(ids);

  const searchBar = useMemo(() => searchBarOptions(theme, 'Search favorites'), [theme]);

  const handleChangeText = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => setSearch(event.nativeEvent.text),
    [],
  );

  // Cancelling doesn't always emit an empty change, so reset explicitly to restore the full list.
  const handleCancel = useCallback(() => setSearch(''), []);

  const handleRefresh = useCallback(async () => {
    setIsPullRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsPullRefreshing(false);
    }
  }, [refetch]);

  const term = search.trim();
  const posts = useMemo(() => matchingPosts(snapshots, term), [snapshots, term]);
  const empty = emptyState(term);
  const syncedAt = oldestSync(snapshots);

  const state: PostListState = {
    status: 'ready',
    posts,
    footer: IDLE_FOOTER,
    onEndReached: noop,
    isRefreshing: isPullRefreshing,
    onRefresh: handleRefresh,
  };

  return (
    <>
      <Stack.SearchBar
        {...searchBar}
        onChangeText={handleChangeText}
        onCancelButtonPress={handleCancel}
      />
      <PostList
        state={state}
        emptyMessage={empty.message}
        emptyHint={empty.hint}
        header={!isOnline && syncedAt !== undefined ? <OfflineNotice updatedAt={syncedAt} /> : null}
        onPressPost={openPost}
        renderAccessory={renderFavoriteToggle}
      />
    </>
  );
}
