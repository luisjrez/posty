import { useCallback } from 'react';
import { Pressable, View, type PressableStateCallbackType } from 'react-native';

import { Text } from '@/shared/components';

import { styles } from './PostCard.styles';
import type { PostCardProps } from './PostCard.types';

function contentStyle({ pressed }: PressableStateCallbackType) {
  return [styles.content, pressed && styles.pressed];
}

export function PostCard({ post, onPress, accessory }: PostCardProps) {
  const handlePress = useCallback(() => onPress(post), [onPress, post]);

  return (
    // The accessory is a sibling of the pressable content, not a child: nested buttons are
    // merged into one element by screen readers and steal each other's presses.
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        // The title names the card; without it screen readers would read title and body as one label.
        accessibilityLabel={post.title}
        accessibilityHint="Opens the post"
        onPress={handlePress}
        style={contentStyle}
      >
        <Text variant="title" numberOfLines={2}>
          {post.title}
        </Text>
        <Text variant="bodySm" color="secondary" numberOfLines={2}>
          {post.body}
        </Text>
      </Pressable>
      {accessory ? <View style={styles.accessory}>{accessory}</View> : null}
    </View>
  );
}
