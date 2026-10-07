import { act } from '@testing-library/react-native';

import { storage } from '@/shared/lib';
import { buildComment, buildPost } from '@/test';

import { useFavoritesStore } from './favorites.store';
import { FAVORITES_STORE_VERSION, migrateFavorites } from './migrateFavorites';

const SAVED_AT = new Date('2026-10-01T10:00:00Z').getTime();
const SYNCED_AT = new Date('2026-10-02T10:00:00Z').getTime();

const { toggle, upsertSnapshots } = useFavoritesStore.getState();

beforeEach(() => {
  jest.useFakeTimers({ now: SAVED_AT });
  storage.clearAll();
  useFavoritesStore.setState({ favorites: {} });
});

afterEach(() => jest.useRealTimers());

describe('favorites store', () => {
  it('toggle saves a snapshot and removes it on the second call', () => {
    const post = buildPost();

    toggle({ post });
    expect(useFavoritesStore.getState().favorites[post.id]).toEqual({
      post,
      savedAt: SAVED_AT,
      syncedAt: SAVED_AT,
    });

    toggle({ post });
    expect(useFavoritesStore.getState().favorites).toEqual({});
  });

  it('upsertSnapshots refreshes Favorites only and keeps savedAt', () => {
    const favorite = buildPost();
    const other = buildPost();
    toggle({ post: favorite });
    jest.setSystemTime(SYNCED_AT);

    upsertSnapshots([{ post: { ...favorite, title: 'Edited' } }, { post: other }]);

    const { favorites } = useFavoritesStore.getState();
    expect(favorites[favorite.id]).toEqual({
      post: { ...favorite, title: 'Edited' },
      savedAt: SAVED_AT,
      syncedAt: SYNCED_AT,
    });
    expect(favorites[other.id]).toBeUndefined();
  });

  it('upsertSnapshots keeps the saved Comments when none are given', () => {
    const post = buildPost();
    const comments = [buildComment({ postId: post.id })];
    toggle({ post, comments });

    upsertSnapshots([{ post }]);

    expect(useFavoritesStore.getState().favorites[post.id]?.comments).toEqual(comments);
  });

  it('upsertSnapshots does not notify subscribers when nothing is a Favorite', () => {
    const listener = jest.fn();
    const unsubscribe = useFavoritesStore.subscribe(listener);

    upsertSnapshots([{ post: buildPost() }]);

    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });
});

describe('favorites persistence', () => {
  it('writes the Favorites with the store version', () => {
    const post = buildPost();

    toggle({ post });

    const persisted: unknown = JSON.parse(storage.getString('favorites') ?? 'null');
    expect(persisted).toEqual({
      state: { favorites: { [post.id]: { post, savedAt: SAVED_AT, syncedAt: SAVED_AT } } },
      version: FAVORITES_STORE_VERSION,
    });
  });

  it('rehydrates the Favorites saved on disk', async () => {
    const post = buildPost();
    const snapshot = { post, savedAt: SAVED_AT, syncedAt: SAVED_AT };
    storage.set(
      'favorites',
      JSON.stringify({ state: { favorites: { [post.id]: snapshot } }, version: 1 }),
    );

    await act(() => useFavoritesStore.persist.rehydrate());

    expect(useFavoritesStore.getState().favorites).toEqual({ [post.id]: snapshot });
  });

  it('runs migrate for an older version and drops an unreadable payload', async () => {
    storage.set('favorites', JSON.stringify({ state: { ids: [1, 2] }, version: 0 }));

    await act(() => useFavoritesStore.persist.rehydrate());

    expect(useFavoritesStore.getState().favorites).toEqual({});
  });
});

describe('migrateFavorites', () => {
  it('keeps a valid payload', () => {
    const post = buildPost();
    const favorites = { [post.id]: { post, savedAt: SAVED_AT, syncedAt: SAVED_AT } };

    expect(migrateFavorites({ favorites }, 0)).toEqual({ favorites });
  });

  it('falls back to no Favorites for anything else', () => {
    expect(migrateFavorites(null, 0)).toEqual({ favorites: {} });
    expect(migrateFavorites({ favorites: { 1: { post: 'x' } } }, 0)).toEqual({ favorites: {} });
  });
});
