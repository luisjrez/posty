import { useCallback } from 'react';
import { Pressable, View, type PressableStateCallbackType } from 'react-native';

import { Text } from '@/shared/components';

import { styles } from './PostCard.styles';
import type { PostCardProps } from './PostCard.types';

function cardStyle({ pressed }: PressableStateCallbackType) {
  return [styles.card, pressed && styles.pressed];
}

export function PostCard({ post, onPress, accessory }: PostCardProps) {
  const handlePress = useCallback(() => onPress(post), [onPress, post]);

  return (
    // The whole card is the press area; the accessory floats over its corner as a sibling, not a
    // child, because nested buttons are merged into one element by screen readers.
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        // The title names the card; without it screen readers would read title and body as one label.
        accessibilityLabel={post.title}
        accessibilityHint="Opens the post"
        onPress={handlePress}
        style={cardStyle}
      >
        <Text
          variant="title"
          numberOfLines={2}
          style={accessory ? styles.titleBesideAccessory : null}
        >
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
