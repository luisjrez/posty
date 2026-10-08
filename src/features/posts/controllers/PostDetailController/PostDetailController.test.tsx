import { http, HttpResponse } from 'msw';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { useFavoritesStore } from '@/features/favorites';
import { Text } from '@/shared/components';
import { storage } from '@/shared/lib';
import { API_URL, buildPost, renderScreenInStack, server } from '@/test';

import { PostDetailController } from './PostDetailController';

// Routes render without props; the controller's props type forbids any.
function HomeStub() {
  return <Text>Home</Text>;
}

function DetailRoute() {
  return <PostDetailController />;
}

async function openDetail(id: string) {
  await renderScreenInStack(HomeStub, { 'posts/[id]': DetailRoute });
  await act(() => router.push(`/posts/${id}`));
}

beforeEach(() => {
  storage.clearAll();
  useFavoritesStore.setState({ favorites: {} });
});

describe('PostDetailController', () => {
  it('loads the Post with its Comments behind a skeleton', async () => {
    await openDetail('3');

    expect(screen.getByLabelText('Loading post')).toBeOnTheScreen();
    expect(await screen.findByText('Comment 2 on post 3')).toBeOnTheScreen();
    expect(screen.getByText('Post 3')).toBeOnTheScreen();
    expect(screen.getByText('Body of post 3')).toBeOnTheScreen();
    expect(screen.getByText('user32@example.com')).toBeOnTheScreen();
    expect(screen.getByText('Body of comment 32')).toBeOnTheScreen();
  });

  it('says the Post was not found when the server returns 404', async () => {
    await openDetail('999');

    expect(await screen.findByText('Post not found')).toBeOnTheScreen();
  });

  it('says the Post was not found for an invalid id without asking the server', async () => {
    const requests: string[] = [];
    server.events.on('request:start', ({ request }) => requests.push(request.url));

    await openDetail('abc');

    expect(await screen.findByText('Post not found')).toBeOnTheScreen();
    expect(requests).toEqual([]);
  });

  it('shows an error with a retry that recovers', async () => {
    server.use(http.get(`${API_URL}/posts/:id`, () => new HttpResponse(null, { status: 500 })));
    await openDetail('4');

    expect(await screen.findByText('Could not load post')).toBeOnTheScreen();

    server.resetHandlers();
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Comment 1 on post 4')).toBeOnTheScreen();
  });

  it('shows a revisited Post straight from its own cache, without the skeleton', async () => {
    await openDetail('6');
    await screen.findByText('Comment 1 on post 6');

    await act(() => router.back());
    await act(() => router.push('/posts/6'));

    expect(screen.getByText('Comment 1 on post 6')).toBeOnTheScreen();
    expect(screen.queryByLabelText('Loading post')).not.toBeOnTheScreen();
  });

  it('saves the Post with its Comments from the header heart', async () => {
    await openDetail('3');
    await screen.findByText('Comment 1 on post 3');

    await fireEvent.press(screen.getByTestId('favorite-toggle-3'));

    expect(screen.getByTestId('favorite-toggle-3')).toBeSelected();
    expect(useFavoritesStore.getState().favorites[3]?.comments).toHaveLength(2);
  });

  it('refreshes a saved Favorite with the Post and Comments it just fetched', async () => {
    useFavoritesStore.getState().toggle({ post: buildPost({ id: 4, title: 'Old title' }) });

    await openDetail('4');
    await screen.findByText('Comment 1 on post 4');

    const favorite = useFavoritesStore.getState().favorites[4];
    expect(favorite?.post.title).toBe('Post 4');
    expect(favorite?.comments).toHaveLength(2);
  });
});
