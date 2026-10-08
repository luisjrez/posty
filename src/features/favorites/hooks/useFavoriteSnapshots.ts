import { useMemo } from 'react';

import type { FavoriteSnapshot } from '../model';
import { useFavoritesStore } from '../store/favorites.store';

function newestFirst(a: FavoriteSnapshot, b: FavoriteSnapshot) {
  return b.savedAt - a.savedAt;
}

// The saved copies are the Favorites tab's source of truth: they render offline, and the
// online refresh writes back into them rather than replacing them.
export function useFavoriteSnapshots(): FavoriteSnapshot[] {
  const favorites = useFavoritesStore((state) => state.favorites);
  return useMemo(() => Object.values(favorites).sort(newestFirst), [favorites]);
}
