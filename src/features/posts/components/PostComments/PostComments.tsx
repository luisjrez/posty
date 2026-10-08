import { View } from 'react-native';

import { Text } from '@/shared/components';

import { CommentItem } from '../CommentItem';

import { styles } from './PostComments.styles';
import type { PostCommentsProps } from './PostComments.types';

function CommentsBody({ comments }: PostCommentsProps) {
  if (comments === undefined) {
    return <Text color="secondary">Open this post online once to read its comments offline.</Text>;
  }
  if (comments.length === 0) return <Text color="secondary">No comments yet</Text>;
  return comments.map((comment) => <CommentItem key={comment.id} comment={comment} />);
}

// Comments are a short, bounded list (jsonplaceholder has five per Post), so they render
// inline in the detail's scroll view instead of a virtualized list.
export function PostComments({ comments }: PostCommentsProps) {
  return (
    <View style={styles.container}>
      <Text variant="title" accessibilityRole="header">
        Comments
      </Text>
      <CommentsBody comments={comments} />
    </View>
  );
}
