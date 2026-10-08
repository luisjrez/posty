import { View } from 'react-native';

import { PostCardSkeleton } from '../PostCardSkeleton';

import { styles } from './PostListSkeleton.styles';
import type { PostListSkeletonProps } from './PostListSkeleton.types';

// Enough cards to fill a phone screen, so no blank gap shows below the skeletons.
const SKELETON_KEYS = Array.from({ length: 6 }, (_, index) => `skeleton-${index}`);

export function PostListSkeleton(_props: PostListSkeletonProps) {
  return (
    <View accessible accessibilityLabel="Loading posts" style={styles.container}>
      {SKELETON_KEYS.map((key) => (
        <PostCardSkeleton key={key} />
      ))}
    </View>
  );
}
