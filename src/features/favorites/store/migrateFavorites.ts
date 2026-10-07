import { z } from 'zod';

import { FavoritesSchema, type Favorites } from '../model';

export const FAVORITES_STORE_VERSION = 1;

const PersistedSchema = z.object({ favorites: FavoritesSchema });

export function migrateFavorites(persisted: unknown, _version: number): { favorites: Favorites } {
  const result = PersistedSchema.safeParse(persisted);
  return { favorites: result.success ? result.data.favorites : {} };
}
