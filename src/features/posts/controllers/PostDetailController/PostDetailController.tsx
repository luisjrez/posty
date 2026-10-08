import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';

import type { PostCommentsState } from '../../components/PostComments';
import { PostDetail, type PostDetailState } from '../../components/PostDetail';
import { usePostDetail } from '../../hooks/usePostDetail';

import type { PostDetailControllerProps } from './PostDetailController.types';
import { parsePostId } from './PostDetailController.utils';

// Turns the route param and the detail query into one view state; PostDetail never fetches.
export function PostDetailController(_props: PostDetailControllerProps) {
  const { id } = useLocalSearchParams();
  const { post, comments, isNotFound, isError, refetch } = usePostDetail(parsePostId(id));

  const handleRetry = useCallback(() => void refetch(), [refetch]);

  let state: PostDetailState;
  if (isNotFound) {
    state = { status: 'notFound' };
  } else if (post) {
    let commentsState: PostCommentsState;
    if (comments) commentsState = { status: 'ready', comments };
    else if (isError) commentsState = { status: 'error', onRetry: handleRetry };
    else commentsState = { status: 'loading' };
    state = { status: 'ready', post, comments: commentsState };
  } else if (isError) {
    state = { status: 'error', onRetry: handleRetry };
  } else {
    state = { status: 'loading' };
  }

  return <PostDetail state={state} />;
}
