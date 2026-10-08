import type { Post } from '@/features/posts';

import type { FavoriteSnapshot } from '../../model';

// Local and case-insensitive: Favorites are few and must be searchable offline.
// `term` is the already-trimmed search.
export function matchingPosts(snapshots: readonly FavoriteSnapshot[], term: string): Post[] {
  const needle = term.toLowerCase();
  const posts = snapshots.map((snapshot) => snapshot.post);
  return needle ? posts.filter((post) => post.title.toLowerCase().includes(needle)) : posts;
}

// The oldest copy bounds how stale the screen can be, so that is the time the notice shows.
export function oldestSync(snapshots: readonly FavoriteSnapshot[]): number | undefined {
  if (snapshots.length === 0) return undefined;
  return Math.min(...snapshots.map((snapshot) => snapshot.syncedAt));
}

const EMPTY_HINT = 'Tap the heart on a post to save it here.';

// Without a search the list is empty because nothing is saved yet, so it says how to save.
export function emptyState(term: string): { message: string; hint: string | undefined } {
  return term
    ? { message: `No favorites match "${term}"`, hint: undefined }
    : { message: 'No favorites yet', hint: EMPTY_HINT };
}
