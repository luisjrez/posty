import { View } from 'react-native';

import { styles } from './PostCardSkeleton.styles';
import type { PostCardSkeletonProps } from './PostCardSkeleton.types';

// Mirrors PostCard's shape so the list doesn't jump when the first page arrives.
export function PostCardSkeleton(_props: PostCardSkeletonProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.line, styles.title]} />
      <View style={styles.line} />
      <View style={[styles.line, styles.short]} />
    </View>
  );
}
