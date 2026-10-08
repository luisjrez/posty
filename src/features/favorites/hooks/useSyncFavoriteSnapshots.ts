import { useEffect } from 'react';

import { useFavoritesStore, type SnapshotInput } from '../store/favorites.store';

// Called explicitly by every screen that fetches Posts: whenever fresh data arrives, saved
// copies of the Posts that are Favorites are refreshed. Non-favorites are ignored by the store.
// `fetchedAt` is the query's dataUpdatedAt, so data served from cache doesn't look newer than
// it is (the offline notice reads it). Callers memoize `inputs` so this runs once per fetch.
export function useSyncFavoriteSnapshots(
  inputs: readonly SnapshotInput[] | undefined,
  fetchedAt: number,
) {
  const upsertSnapshots = useFavoritesStore((state) => state.upsertSnapshots);

  useEffect(() => {
    if (inputs && inputs.length > 0) upsertSnapshots(inputs, fetchedAt);
  }, [inputs, fetchedAt, upsertSnapshots]);
}
