import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';

import { PostDetail } from '../../components/PostDetail';
import { usePostDetail } from '../../hooks/usePostDetail';

import type { PostDetailControllerProps } from './PostDetailController.types';
import { detailState, parsePostId } from './PostDetailController.utils';

// Turns the route param and the detail query into one view state; PostDetail never fetches.
export function PostDetailController(_props: PostDetailControllerProps) {
  const { id } = useLocalSearchParams();
  const { refetch, ...detail } = usePostDetail(parsePostId(id));

  const handleRetry = useCallback(() => void refetch(), [refetch]);

  return <PostDetail state={detailState({ ...detail, onRetry: handleRetry })} />;
}
