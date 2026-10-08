import { ScrollView, View } from 'react-native';

import { EmptyState, ErrorState, OfflineNotice, Text } from '@/shared/components';

import { PostComments } from '../PostComments';

import { styles } from './PostDetail.styles';
import type { PostDetailProps } from './PostDetail.types';

function PostDetailBody({ state }: PostDetailProps) {
  switch (state.status) {
    case 'loading':
      return (
        <View accessible accessibilityLabel="Loading post" style={styles.skeleton}>
          <View style={[styles.line, styles.titleLine]} />
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={[styles.line, styles.short]} />
        </View>
      );
    case 'notFound':
      return (
        <EmptyState
          title="Post not found"
          message="It may have been removed, or the link is wrong."
        />
      );
    case 'error':
      return (
        <ErrorState
          title="Could not load post"
          message="Check your connection and try again."
          onRetry={state.onRetry}
        />
      );
    case 'ready':
      return (
        <>
          {state.offlineUpdatedAt === undefined ? null : (
            <OfflineNotice updatedAt={state.offlineUpdatedAt} />
          )}
          <View style={styles.post}>
            <Text variant="display" accessibilityRole="header">
              {state.post.title}
            </Text>
            <Text>{state.post.body}</Text>
          </View>
          <PostComments comments={state.comments} />
        </>
      );
  }
}

export function PostDetail({ state }: PostDetailProps) {
  return (
    // Kept as the screen's only scroll view in every state so the native header can track it.
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <PostDetailBody state={state} />
    </ScrollView>
  );
}
