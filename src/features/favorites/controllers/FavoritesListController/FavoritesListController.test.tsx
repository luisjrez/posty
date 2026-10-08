import { onlineManager } from '@tanstack/react-query';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';

import { storage } from '@/shared/lib';
import { buildPost, renderScreenInStack, server, typeInHeaderSearch } from '@/test';

import { useFavoritesStore } from '../../store/favorites.store';

import { FavoritesListController } from './FavoritesListController';

const SYNCED_AT = new Date('2026-10-08T11:00:00Z').getTime();
const NOW = new Date('2026-10-08T12:00:00Z').getTime();

// Routes render without props; the controller's props type forbids any.
function FavoritesRoute() {
  return <FavoritesListController />;
}

// Seeds saved snapshots whose titles differ from the server's, so a refresh is visible.
function saveFavorites(ids: number[]) {
  useFavoritesStore.setState({
    favorites: Object.fromEntries(
      ids.map((id, index) => [
        id,
        {
          post: buildPost({ id, title: `Saved post ${id}` }),
          savedAt: SYNCED_AT + index,
          syncedAt: SYNCED_AT,
        },
      ]),
    ),
  });
}

function trackRequests() {
  const requests: string[] = [];
  server.events.on('request:start', ({ request }) => requests.push(request.url));
  return requests;
}

beforeEach(() => {
  storage.clearAll();
  useFavoritesStore.setState({ favorites: {} });
});

afterEach(() => onlineManager.setOnline(true));

describe('FavoritesListController', () => {
  it('explains how to save a Post when there are no Favorites', async () => {
    await renderScreenInStack(FavoritesRoute);

    expect(screen.getByText('No favorites yet')).toBeOnTheScreen();
    expect(screen.getByText('Tap the heart on a post to save it here.')).toBeOnTheScreen();
  });

  it('shows saved copies at once, then refreshes them in one request and saves them back', async () => {
    saveFavorites([3, 7]);
    const requests = trackRequests();

    await renderScreenInStack(FavoritesRoute);

    expect(screen.getByText('Saved post 3')).toBeOnTheScreen();
    expect(await screen.findByText('Post 7')).toBeOnTheScreen();
    expect(screen.getByText('Post 3')).toBeOnTheScreen();
    expect(requests).toHaveLength(1);
    expect(new URL(requests[0] ?? '').searchParams.getAll('id').sort()).toEqual(['3', '7']);
    expect(useFavoritesStore.getState().favorites[7]?.post.title).toBe('Post 7');
  });

  it('lists the most recently saved Favorite first', async () => {
    saveFavorites([3, 7]);
    await renderScreenInStack(FavoritesRoute);
    await screen.findByText('Post 7');

    const titles = screen.getAllByRole('button', { name: /^Post \d+$/ });

    expect(titles.map((card) => card.props.accessibilityLabel)).toEqual(['Post 7', 'Post 3']);
  });

  it('searches the saved titles locally', async () => {
    saveFavorites([3, 7]);
    await renderScreenInStack(FavoritesRoute);
    await screen.findByText('Post 7');
    const requests = trackRequests();

    await typeInHeaderSearch('post 3');

    expect(screen.getByText('Post 3')).toBeOnTheScreen();
    expect(screen.queryByText('Post 7')).not.toBeOnTheScreen();
    expect(requests).toEqual([]);
  });

  it('says when no Favorite matches the search', async () => {
    saveFavorites([3]);
    await renderScreenInStack(FavoritesRoute);

    await typeInHeaderSearch('zzz');

    expect(screen.getByText('No favorites match "zzz"')).toBeOnTheScreen();
  });

  it('removes a Favorite with its heart', async () => {
    saveFavorites([3, 7]);
    await renderScreenInStack(FavoritesRoute);
    await screen.findByText('Post 7');

    await fireEvent.press(screen.getByTestId('post-7-favorite'));

    await waitFor(() => expect(screen.queryByText('Post 7')).not.toBeOnTheScreen());
    expect(Object.keys(useFavoritesStore.getState().favorites)).toEqual(['3']);
  });

  it('renders the saved copies offline with a notice and sends no request', async () => {
    jest.useFakeTimers({ now: NOW, doNotFake: ['setImmediate', 'nextTick', 'queueMicrotask'] });
    onlineManager.setOnline(false);
    saveFavorites([3]);
    const requests = trackRequests();

    await renderScreenInStack(FavoritesRoute);

    expect(screen.getByText('Saved post 3')).toBeOnTheScreen();
    expect(screen.getByText('Offline · updated 1 h ago')).toBeOnTheScreen();
    expect(requests).toEqual([]);
    jest.useRealTimers();
  });

  it('hides the notice once the connection is back', async () => {
    onlineManager.setOnline(false);
    saveFavorites([3]);
    await renderScreenInStack(FavoritesRoute);
    expect(screen.getByText(/^Offline · updated/)).toBeOnTheScreen();

    await act(() => onlineManager.setOnline(true));

    expect(screen.queryByText(/^Offline · updated/)).not.toBeOnTheScreen();
    expect(await screen.findByText('Post 3')).toBeOnTheScreen();
  });
});
