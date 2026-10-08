import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { postsByIdsOptions, type PostId } from '@/features/posts';

import { useSyncFavoriteSnapshots } from './useSyncFavoriteSnapshots';

// Refreshes every saved Post in one request and writes the result back into the snapshots.
// Offline the query is paused, so the screen keeps showing the saved copies untouched.
export function useFavoritePosts(ids: readonly PostId[]) {
  const query = useQuery(postsByIdsOptions(ids));
  const inputs = useMemo(() => query.data?.map((post) => ({ post })), [query.data]);
  useSyncFavoriteSnapshots(inputs, query.dataUpdatedAt);
  return query;
}
