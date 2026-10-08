import type { PostId } from '@/features/posts';

import type { FavoriteSnapshot } from '../model';
import { useFavoritesStore } from '../store/favorites.store';

export function useFavoriteSnapshot(id: PostId | null): FavoriteSnapshot | undefined {
  return useFavoritesStore((state) => (id === null ? undefined : state.favorites[id]));
}
