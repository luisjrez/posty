import { router, Stack } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  type ListRenderItem,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
} from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { searchBarOptions } from '@/design-system';
import { Box, Button, Text } from '@/shared/components';
import { useDebouncedValue } from '@/shared/lib';

import { PostCard } from '../../components/PostCard';
import { PostCardSkeleton } from '../../components/PostCardSkeleton';
import { usePostsList } from '../../hooks/usePostsList';
import type { Post } from '../../model';

import type { PostsScreenProps } from './PostsScreen.types';
import { styles } from './PostsScreen.styles';
import { listFooter, listPlaceholder } from './PostsScreen.utils';

const SEARCH_DEBOUNCE_MS = 300;
const SKELETON_ROWS = Array.from({ length: 6 }, (_, index) => index);

const keyExtractor = (post: Post) => String(post.id);

function openPost(post: Post) {
  router.push(`/posts/${post.id}`);
}

const renderPost: ListRenderItem<Post> = ({ item }) => <PostCard post={item} onPress={openPost} />;

function ListSkeleton() {
  return (
    <Box accessible accessibilityLabel="Loading posts" style={styles.skeleton}>
      {SKELETON_ROWS.map((row) => (
        <PostCardSkeleton key={row} />
      ))}
    </Box>
  );
}

type ListErrorProps = { onRetry: () => void };

function ListError({ onRetry }: ListErrorProps) {
  return (
    <Box style={styles.message}>
      <Text variant="title" align="center" accessibilityRole="alert">
        Could not load posts
      </Text>
      <Text color="secondary" align="center">
        Check your connection and try again.
      </Text>
      <Button label="Retry" onPress={onRetry} />
    </Box>
  );
}

type NoResultsProps = { search: string };

function NoResults({ search }: NoResultsProps) {
  return (
    <Box style={styles.message}>
      <Text color="muted" align="center">
        {search ? `No posts match "${search}"` : 'No posts yet'}
      </Text>
    </Box>
  );
}

export function PostsScreen(_props: PostsScreenProps) {
  const { theme } = useUnistyles();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const {
    data,
    isPending,
    isError,
    isPlaceholderData,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePostsList(debouncedSearch);

  const posts = data?.posts ?? [];
  const placeholder = listPlaceholder({ isPending, isError, postCount: posts.length });
  const footer = listFooter({
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    postCount: posts.length,
  });

  const searchBar = useMemo(() => searchBarOptions(theme, 'Search posts'), [theme]);

  const handleChangeText = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => setSearch(event.nativeEvent.text),
    [],
  );

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

  const emptyComponent = {
    loading: <ListSkeleton />,
    error: <ListError onRetry={handleRetry} />,
    noResults: <NoResults search={debouncedSearch} />,
    none: null,
  }[placeholder];

  const footerComponent = {
    loadingMore: (
      <Box style={styles.footer}>
        <ActivityIndicator accessibilityLabel="Loading more posts" />
      </Box>
    ),
    loadMoreError: (
      <Box style={styles.footer}>
        <Text color="secondary">Could not load more posts</Text>
        <Button label="Retry" onPress={handleLoadMore} />
      </Box>
    ),
    end: (
      <Box style={styles.footer}>
        <Text variant="caption" color="muted">
          You&apos;ve reached the end
        </Text>
      </Box>
    ),
    none: null,
  }[footer];

  return (
    <>
      <Stack.SearchBar
        {...searchBar}
        onChangeText={handleChangeText}
        onCancelButtonPress={handleCancel}
      />
      <FlatList
        testID="posts-list"
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderPost}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={footerComponent}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshing={isPullRefreshing}
        onRefresh={handleRefresh}
        keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="automatic"
        style={styles.list}
        contentContainerStyle={styles.content}
        aria-busy={isPlaceholderData}
      />
    </>
  );
}
