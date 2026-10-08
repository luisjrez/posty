import { View } from 'react-native';

import { Text } from '@/shared/components';

import { CommentItem } from '../CommentItem';

import { styles } from './PostComments.styles';
import type { PostCommentsProps } from './PostComments.types';

// Comments are a short, bounded list (jsonplaceholder has five per Post), so they render
// inline in the detail's scroll view instead of a virtualized list.
export function PostComments({ comments }: PostCommentsProps) {
  return (
    <View style={styles.container}>
      <Text variant="title" accessibilityRole="header">
        Comments
      </Text>
      {comments.length === 0 ? (
        <Text color="secondary">No comments yet</Text>
      ) : (
        comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
      )}
    </View>
  );
}
