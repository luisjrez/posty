import { z } from 'zod';

import { CommentSchema, PostSchema } from '@/features/posts';

export const FavoriteSnapshotSchema = z.object({
  post: PostSchema,
  comments: z.array(CommentSchema).optional(),
  savedAt: z.number(),
  syncedAt: z.number(),
});

export type FavoriteSnapshot = z.infer<typeof FavoriteSnapshotSchema>;

export const FavoritesSchema = z.record(z.number(), FavoriteSnapshotSchema);

export type Favorites = z.infer<typeof FavoritesSchema>;
