import type { PostId } from '@/features/posts';

import { useFavoritesStore } from '../store/favorites.store';

export function useIsFavorite(id: PostId): boolean {
  return useFavoritesStore((state) => id in state.favorites);
}
