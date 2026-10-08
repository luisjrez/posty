import { View } from 'react-native';

import { EmptyState, ErrorState } from '@/shared/components';

import { PostListSkeleton } from '../PostListSkeleton';

import { styles } from './PostListPlaceholder.styles';
import type { PostListPlaceholderProps } from './PostListPlaceholder.types';

// What the list shows in place of rows: the first load, its failure, or no matches.
export function PostListPlaceholder({ state, emptyMessage }: PostListPlaceholderProps) {
  switch (state.status) {
    case 'loading':
      return <PostListSkeleton />;
    case 'error':
      return (
        <View style={styles.container}>
          <ErrorState
            title="Could not load posts"
            message="Check your connection and try again."
            onRetry={state.onRetry}
          />
        </View>
      );
    case 'ready':
      return <EmptyState title={emptyMessage} />;
  }
}
