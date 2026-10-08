import { View } from 'react-native';

import { Button, Text } from '@/shared/components';

import { CommentItem } from '../CommentItem';

import { styles } from './PostComments.styles';
import type { PostCommentsProps } from './PostComments.types';

// Comments are a short, bounded list (jsonplaceholder has five per Post), so they render
// inline in the detail's scroll view instead of a virtualized list.
function CommentsBody({ state }: PostCommentsProps) {
  switch (state.status) {
    case 'loading':
      return (
        <View accessible accessibilityLabel="Loading comments" style={styles.skeleton}>
          <View style={styles.line} />
          <View style={[styles.line, styles.short]} />
        </View>
      );
    case 'error':
      return (
        <View style={styles.error}>
          <Text color="secondary" accessibilityRole="alert">
            Could not load comments
          </Text>
          <Button label="Retry" onPress={state.onRetry} />
        </View>
      );
    case 'ready':
      if (state.comments.length === 0) return <Text color="secondary">No comments yet</Text>;
      return state.comments.map((comment) => <CommentItem key={comment.id} comment={comment} />);
  }
}

export function PostComments({ state }: PostCommentsProps) {
  return (
    <View style={styles.container}>
      <Text variant="title" accessibilityRole="header">
        Comments
      </Text>
      <CommentsBody state={state} />
    </View>
  );
}
