import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { useCallback } from 'react';
import { View } from 'react-native';

import { EmptyState, ErrorState } from '@/shared/components';

import type { Post } from '../../model';
import { PostCard } from '../PostCard';
import { PostListFooter } from '../PostListFooter';
import { PostListSkeleton } from '../PostListSkeleton';

import { styles } from './PostList.styles';
import type { PostListProps } from './PostList.types';
import { keyExtractor } from './PostList.utils';

// Start the next page about half a screen early so scrolling rarely reaches the footer.
const END_REACHED_THRESHOLD = 0.5;

function ItemSeparator() {
  return <View style={styles.separator} />;
}

export function PostList({ state, emptyMessage, onPressPost }: PostListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Post>) => <PostCard post={item} onPress={onPressPost} />,
    [onPressPost],
  );

  if (state.status === 'loading') return <PostListSkeleton />;

  if (state.status === 'error') {
    return (
      <View style={styles.container}>
        <ErrorState
          title="Could not load posts"
          message="Check your connection and try again."
          onRetry={state.onRetry}
        />
      </View>
    );
  }

  return (
    // The themed background sits on a core View: Unistyles only updates `style` on React Native
    // core components, so FlashList's own `style` would keep the previous theme.
    <View style={styles.container}>
      <FlashList
        testID="posts-list"
        data={state.posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={<EmptyState title={emptyMessage} />}
        ListFooterComponent={<PostListFooter state={state.footer} />}
        onEndReached={state.onEndReached}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        refreshing={state.isRefreshing}
        onRefresh={state.onRefresh}
        keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
      />
    </View>
  );
}
