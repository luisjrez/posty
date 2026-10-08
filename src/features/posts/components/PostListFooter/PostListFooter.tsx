import { ActivityIndicator, View } from 'react-native';

import { Button, Text } from '@/shared/components';

import { styles } from './PostListFooter.styles';
import type { PostListFooterProps } from './PostListFooter.types';

export function PostListFooter({ state }: PostListFooterProps) {
  switch (state.status) {
    case 'idle':
      return null;
    case 'loadingMore':
      return (
        <View style={styles.container}>
          <ActivityIndicator accessibilityLabel="Loading more posts" />
        </View>
      );
    case 'loadMoreFailed':
      return (
        <View style={styles.container}>
          <Text color="secondary">Could not load more posts</Text>
          <Button label="Retry" onPress={state.onRetry} />
        </View>
      );
    case 'end':
      return (
        <View style={styles.container}>
          <Text variant="caption" color="muted">
            You&apos;ve reached the end
          </Text>
        </View>
      );
  }
}
