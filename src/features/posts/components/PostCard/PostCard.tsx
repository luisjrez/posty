import { useCallback } from 'react';
import { Pressable, type PressableStateCallbackType } from 'react-native';

import { Text } from '@/shared/components';

import { styles } from './PostCard.styles';
import type { PostCardProps } from './PostCard.types';

function cardStyle({ pressed }: PressableStateCallbackType) {
  return [styles.card, pressed && styles.pressed];
}

export function PostCard({ post, onPress }: PostCardProps) {
  const handlePress = useCallback(() => onPress(post), [onPress, post]);

  return (
    <Pressable
      accessibilityRole="button"
      // The title names the card; without it screen readers would read title and body as one label.
      accessibilityLabel={post.title}
      accessibilityHint="Opens the post"
      onPress={handlePress}
      style={cardStyle}
    >
      <Text variant="title" numberOfLines={2}>
        {post.title}
      </Text>
      <Text variant="bodySm" color="secondary" numberOfLines={2}>
        {post.body}
      </Text>
    </Pressable>
  );
}
