import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';

import {
  FavoriteToggle,
  useFavoriteSnapshot,
  useSyncFavoriteSnapshots,
} from '@/features/favorites';
import { useIsOnline } from '@/shared/query';

import { PostDetail } from '../../components/PostDetail';
import { usePostDetail } from '../../hooks/usePostDetail';

import type { PostDetailControllerProps } from './PostDetailController.types';
import { detailState, parsePostId, toSnapshotInput } from './PostDetailController.utils';

// A deep link can open the detail on a cold start, with no history to go back to.
function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

// Turns the route param and the detail query into one view state; PostDetail never fetches.
export function PostDetailController(_props: PostDetailControllerProps) {
  const { id } = useLocalSearchParams();
  const postId = parsePostId(id);
  const { refetch, fetchedAt, ...detail } = usePostDetail(postId);
  const savedCopy = useFavoriteSnapshot(postId);
  const isOnline = useIsOnline();

  // The detail is the only fetch that carries Comments, so it is what keeps them fresh offline.
  const snapshot = useMemo(() => detail.detail && toSnapshotInput(detail.detail), [detail.detail]);
  const snapshots = useMemo(() => (snapshot ? [snapshot] : undefined), [snapshot]);
  useSyncFavoriteSnapshots(snapshots, fetchedAt);

  // Offline, the heart works on the saved copy so a Favorite can still be removed.
  const toggleTarget = snapshot ?? (isOnline ? undefined : savedCopy);

  const handleRetry = useCallback(() => void refetch(), [refetch]);

  return (
    <>
      {toggleTarget ? (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.View>
            <FavoriteToggle {...toggleTarget} placement="header" />
          </Stack.Toolbar.View>
        </Stack.Toolbar>
      ) : null}
      <PostDetail
        state={detailState({
          ...detail,
          isOnline,
          fetchedAt,
          savedCopy,
          onRetry: handleRetry,
          onGoBack: goBack,
        })}
      />
    </>
  );
}
