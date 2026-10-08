import { ScrollView } from 'react-native';

import { PostCardSkeleton } from '../PostCardSkeleton';

import { styles } from './PostListSkeleton.styles';
import type { PostListSkeletonProps } from './PostListSkeleton.types';

// Enough cards to fill a phone screen, so no blank gap shows below the skeletons.
const SKELETON_KEYS = Array.from({ length: 6 }, (_, index) => `skeleton-${index}`);

// A ScrollView (not a View) keeps the large title and search bar collapsing like the real list.
export function PostListSkeleton(_props: PostListSkeletonProps) {
  return (
    <ScrollView
      accessible
      accessibilityLabel="Loading posts"
      scrollEnabled={false}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      contentContainerStyle={styles.container}
    >
      {SKELETON_KEYS.map((key) => (
        <PostCardSkeleton key={key} />
      ))}
    </ScrollView>
  );
}
