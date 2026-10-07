import { useFavoritesStore } from '../store/favorites.store';

export function useToggleFavorite() {
  return useFavoritesStore((state) => state.toggle);
}
