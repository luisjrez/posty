import type { Post } from '@/features/posts';

import type { FavoriteSnapshot } from '../../model';

// Local and case-insensitive: Favorites are few and must be searchable offline.
export function matchingPosts(snapshots: readonly FavoriteSnapshot[], search: string): Post[] {
  const term = search.trim().toLowerCase();
  const posts = snapshots.map((snapshot) => snapshot.post);
  return term ? posts.filter((post) => post.title.toLowerCase().includes(term)) : posts;
}

// The oldest copy bounds how stale the screen can be, so that is the time the notice shows.
export function oldestSync(snapshots: readonly FavoriteSnapshot[]): number | undefined {
  if (snapshots.length === 0) return undefined;
  return Math.min(...snapshots.map((snapshot) => snapshot.syncedAt));
}

export function emptyMessage(search: string): string {
  const term = search.trim();
  return term ? `No favorites match "${term}"` : 'No favorites yet';
}
