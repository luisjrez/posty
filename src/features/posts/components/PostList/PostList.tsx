import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { useCallback } from 'react';
import { View } from 'react-native';

import type { Post } from '../../model';
import { PostCard } from '../PostCard';
import { PostListFooter } from '../PostListFooter';
import { PostListPlaceholder } from '../PostListPlaceholder';

import { styles } from './PostList.styles';
import type { PostListProps } from './PostList.types';
import { keyExtractor } from './PostList.utils';

// Start the next page about half a screen early so scrolling rarely reaches the footer.
const END_REACHED_THRESHOLD = 0.5;
const EMPTY: readonly Post[] = [];

function ItemSeparator() {
  return <View style={styles.separator} />;
}

export function PostList({ state, emptyMessage, onPressPost }: PostListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Post>) => <PostCard post={item} onPress={onPressPost} />,
    [onPressPost],
  );

  const isReady = state.status === 'ready';

  return (
    // The themed background sits on a core View: Unistyles only updates `style` on React Native
    // core components, so FlashList's own `style` would keep the previous theme.
    // The FlashList stays mounted in every state: iOS binds the large title and header search
    // bar to the first scroll view, so swapping in a different one hides the search bar.
    <View style={styles.container}>
      <FlashList
        testID="posts-list"
        data={isReady ? state.posts : EMPTY}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={<PostListPlaceholder state={state} emptyMessage={emptyMessage} />}
        ListFooterComponent={isReady ? <PostListFooter state={state.footer} /> : null}
        onEndReached={isReady ? state.onEndReached : undefined}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        refreshing={isReady && state.isRefreshing}
        onRefresh={isReady ? state.onRefresh : undefined}
        scrollEnabled={isReady}
        keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
      />
    </View>
  );
}
