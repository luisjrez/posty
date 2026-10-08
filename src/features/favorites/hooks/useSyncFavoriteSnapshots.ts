import { useEffect } from 'react';

import { useFavoritesStore, type SnapshotInput } from '../store/favorites.store';

// Called explicitly by every screen that fetches Posts: whenever fresh data arrives, saved
// copies of the Posts that are Favorites are refreshed. Non-favorites are ignored by the store.
// Callers memoize `inputs` so this runs once per fetch, not once per render.
export function useSyncFavoriteSnapshots(inputs: readonly SnapshotInput[] | undefined) {
  const upsertSnapshots = useFavoritesStore((state) => state.upsertSnapshots);

  useEffect(() => {
    if (inputs && inputs.length > 0) upsertSnapshots(inputs);
  }, [inputs, upsertSnapshots]);
}
