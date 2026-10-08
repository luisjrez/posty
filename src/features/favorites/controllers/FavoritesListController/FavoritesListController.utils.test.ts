import { buildPost } from '@/test';

import { emptyState, matchingPosts, oldestSync } from './FavoritesListController.utils';

function snapshot(title: string, syncedAt: number) {
  return { post: buildPost({ title }), savedAt: syncedAt, syncedAt };
}

const snapshots = [snapshot('Alpha post', 30), snapshot('Beta post', 10)];

describe('matchingPosts', () => {
  it('returns every Post for a blank search', () => {
    expect(matchingPosts(snapshots, '').map((post) => post.title)).toEqual([
      'Alpha post',
      'Beta post',
    ]);
  });

  it('matches titles case-insensitively', () => {
    expect(matchingPosts(snapshots, 'BETA').map((post) => post.title)).toEqual(['Beta post']);
  });
});

describe('oldestSync', () => {
  it('is the oldest sync time, or undefined without Favorites', () => {
    expect(oldestSync(snapshots)).toBe(10);
    expect(oldestSync([])).toBeUndefined();
  });
});

describe('emptyState', () => {
  it('explains how to save when there is no search', () => {
    expect(emptyState('')).toEqual({
      message: 'No favorites yet',
      hint: 'Tap the heart on a post to save it here.',
    });
  });

  it('names the search when nothing matches', () => {
    expect(emptyState('zzz')).toEqual({ message: 'No favorites match "zzz"', hint: undefined });
  });
});
