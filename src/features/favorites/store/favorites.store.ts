import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Comment, Post } from '@/features/posts';
import { zustandStorage } from '@/shared/lib';

import type { FavoriteSnapshot, Favorites } from '../model';

import { FAVORITES_STORE_VERSION, migrateFavorites } from './migrateFavorites';

export type SnapshotInput = { post: Post; comments?: Comment[] | undefined };

type FavoritesState = {
  favorites: Favorites;
  toggle: (input: SnapshotInput) => void;
  upsertSnapshots: (inputs: SnapshotInput[]) => void;
};

function toSnapshot(
  { post, comments }: SnapshotInput,
  savedAt: number,
  syncedAt: number,
): FavoriteSnapshot {
  return comments ? { post, comments, savedAt, syncedAt } : { post, savedAt, syncedAt };
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},

      toggle: (input) =>
        set(({ favorites }) => {
          const next = { ...favorites };
          if (next[input.post.id]) {
            delete next[input.post.id];
          } else {
            const now = Date.now();
            next[input.post.id] = toSnapshot(input, now, now);
          }
          return { favorites: next };
        }),

      upsertSnapshots: (inputs) => {
        const { favorites } = get();
        const now = Date.now();
        const updates: Favorites = {};
        for (const input of inputs) {
          const current = favorites[input.post.id];
          if (!current) continue;
          const comments = input.comments ?? current.comments;
          updates[input.post.id] = toSnapshot({ post: input.post, comments }, current.savedAt, now);
        }
        if (Object.keys(updates).length > 0) set({ favorites: { ...favorites, ...updates } });
      },
    }),
    {
      name: 'favorites',
      storage: createJSONStorage(() => zustandStorage),
      version: FAVORITES_STORE_VERSION,
      migrate: migrateFavorites,
      partialize: ({ favorites }) => ({ favorites }),
    },
  ),
);
