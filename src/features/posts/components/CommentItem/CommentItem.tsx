import { View } from 'react-native';

import { Text } from '@/shared/components';

import { styles } from './CommentItem.styles';
import type { CommentItemProps } from './CommentItem.types';

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <View style={styles.container} testID={`comment-${comment.id}`}>
      <Text variant="label">{comment.name}</Text>
      <Text variant="caption" color="muted">
        {comment.email}
      </Text>
      <Text variant="bodySm" color="secondary">
        {comment.body}
      </Text>
    </View>
  );
}
