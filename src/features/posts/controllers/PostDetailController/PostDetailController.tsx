import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';

import { FavoriteToggle, useSyncFavoriteSnapshots } from '@/features/favorites';

import { PostDetail } from '../../components/PostDetail';
import { usePostDetail } from '../../hooks/usePostDetail';

import type { PostDetailControllerProps } from './PostDetailController.types';
import { detailState, parsePostId, toSnapshotInput } from './PostDetailController.utils';

// Turns the route param and the detail query into one view state; PostDetail never fetches.
export function PostDetailController(_props: PostDetailControllerProps) {
  const { id } = useLocalSearchParams();
  const { refetch, ...detail } = usePostDetail(parsePostId(id));

  // The detail is the only fetch that carries Comments, so it is what keeps them fresh offline.
  const snapshot = useMemo(() => detail.detail && toSnapshotInput(detail.detail), [detail.detail]);
  const snapshots = useMemo(() => (snapshot ? [snapshot] : undefined), [snapshot]);
  useSyncFavoriteSnapshots(snapshots);

  const handleRetry = useCallback(() => void refetch(), [refetch]);

  return (
    <>
      {snapshot ? (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.View>
            <FavoriteToggle post={snapshot.post} comments={snapshot.comments} />
          </Stack.Toolbar.View>
        </Stack.Toolbar>
      ) : null}
      <PostDetail state={detailState({ ...detail, onRetry: handleRetry })} />
    </>
  );
}
