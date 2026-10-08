import { http, HttpResponse } from 'msw';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';

import { useLocalSearchParams } from 'expo-router';

import { useFavoritesStore } from '@/features/favorites';
import { Text } from '@/shared/components';
import { storage } from '@/shared/lib';
import {
  API_URL,
  buildComment,
  buildPost,
  renderScreenInStack,
  server,
  typeInHeaderSearch,
} from '@/test';

import { PostsListController } from './PostsListController';

function failPostsRequests() {
  server.use(http.get(`${API_URL}/posts`, () => new HttpResponse(null, { status: 500 })));
}

// Routes render without props; the controller's props type forbids any.
function PostsRoute() {
  return <PostsListController />;
}

function DetailStub() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Text>Detail of {id}</Text>;
}

beforeEach(() => {
  storage.clearAll();
  useFavoritesStore.setState({ favorites: {} });
});

describe('PostsListController', () => {
  it('shows a skeleton while the first page loads', async () => {
    await renderScreenInStack(PostsRoute);

    expect(screen.getByLabelText('Loading posts')).toBeOnTheScreen();
    expect(await screen.findByText('Post 1')).toBeOnTheScreen();
    expect(screen.queryByLabelText('Loading posts')).not.toBeOnTheScreen();
  });

  it('renders each Post as an accessible card that opens its detail', async () => {
    await renderScreenInStack(PostsRoute, { 'posts/[id]': DetailStub });

    const card = await screen.findByRole('button', { name: 'Post 2' });
    expect(card).toHaveAccessibleName('Post 2');

    await fireEvent.press(card);

    expect(await screen.findByText('Detail of 2')).toBeOnTheScreen();
  });

  it('loads the next page when the end of the list is reached and then says it is the end', async () => {
    await renderScreenInStack(PostsRoute);
    await screen.findByText('Post 1');
    const list = screen.getByTestId('posts-list');

    await fireEvent(list, 'endReached');
    await waitFor(() => expect(screen.queryByLabelText('Loading more posts')).toBeNull());
    await fireEvent(list, 'endReached');

    expect(await screen.findByText("You've reached the end")).toBeOnTheScreen();
  });

  it('offers a retry when the next page fails', async () => {
    await renderScreenInStack(PostsRoute);
    await screen.findByText('Post 1');
    failPostsRequests();

    await fireEvent(screen.getByTestId('posts-list'), 'endReached');
    expect(await screen.findByText('Could not load more posts')).toBeOnTheScreen();

    server.resetHandlers();
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => expect(screen.queryByText('Could not load more posts')).toBeNull());
    expect(screen.queryByLabelText('Loading more posts')).toBeNull();
  });

  it('shows an error with a retry that recovers', async () => {
    failPostsRequests();
    await renderScreenInStack(PostsRoute);

    expect(await screen.findByText('Could not load posts')).toBeOnTheScreen();

    server.resetHandlers();
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Post 1')).toBeOnTheScreen();
  });

  it('narrows the list to the Posts whose title matches the search', async () => {
    await renderScreenInStack(PostsRoute);
    await screen.findByText('Post 1');

    await typeInHeaderSearch('post 4');

    await waitFor(() => expect(screen.queryByText('Post 1')).not.toBeOnTheScreen());
    expect(screen.getByText('Post 4')).toBeOnTheScreen();
    expect(screen.getByText('Post 45')).toBeOnTheScreen();
  });

  it('keeps the previous results on screen while the search is loading', async () => {
    await renderScreenInStack(PostsRoute);
    await screen.findByText('Post 1');

    await typeInHeaderSearch('post 4');

    expect(screen.getByText('Post 1')).toBeOnTheScreen();
    expect(screen.queryByLabelText('Loading posts')).not.toBeOnTheScreen();
    await waitFor(() => expect(screen.queryByText('Post 1')).not.toBeOnTheScreen());
  });

  it('sends one request after the user pauses typing', async () => {
    const searches: (string | null)[] = [];
    server.events.on('request:start', ({ request }) => {
      searches.push(new URL(request.url).searchParams.get('title_like'));
    });
    await renderScreenInStack(PostsRoute);
    await screen.findByText('Post 1');

    await typeInHeaderSearch('p');
    await typeInHeaderSearch('po');
    await typeInHeaderSearch('post 4');

    await waitFor(() => expect(screen.queryByText('Post 1')).not.toBeOnTheScreen());
    // Unfiltered requests are page loads of the initial list; only one search request goes out.
    expect(searches.filter((search) => search !== null)).toEqual(['post 4']);
  });

  it('treats special characters in the search literally', async () => {
    await renderScreenInStack(PostsRoute);
    await screen.findByText('Post 1');

    await typeInHeaderSearch('(');

    expect(await screen.findByText('No posts match "("')).toBeOnTheScreen();
  });

  it('pulls to refresh the list', async () => {
    const pages: (string | null)[] = [];
    await renderScreenInStack(PostsRoute);
    // FlashList keeps paging while its content is shorter than the viewport; wait for the end.
    await screen.findByText("You've reached the end");
    server.events.on('request:start', ({ request }) => {
      pages.push(new URL(request.url).searchParams.get('_page'));
    });

    await fireEvent(screen.getByTestId('posts-list'), 'refresh');

    await waitFor(() => expect(pages).toContain('1'));
    expect(screen.getByText('Post 1')).toBeOnTheScreen();
  });

  it('saves a Post from its card heart and persists it', async () => {
    await renderScreenInStack(PostsRoute);
    const heart = await screen.findByTestId('post-2-favorite');

    await fireEvent.press(heart);

    expect(heart).toBeSelected();
    expect(screen.getByTestId('post-1-favorite')).not.toBeSelected();
    expect(storage.getString('favorites')).toContain('"title":"Post 2"');
  });

  it('refreshes the saved copy of a Favorite, keeping its Comments, when the list is refetched', async () => {
    await renderScreenInStack(PostsRoute);
    await screen.findByText("You've reached the end");
    const comments = [buildComment({ postId: 1 })];
    await act(() => useFavoritesStore.getState().toggle({ post: buildPost({ id: 1 }), comments }));
    server.use(
      http.get(`${API_URL}/posts`, () =>
        HttpResponse.json([buildPost({ id: 1, title: 'Edited' }), buildPost({ id: 2 })], {
          headers: { 'X-Total-Count': '2' },
        }),
      ),
    );

    await fireEvent(screen.getByTestId('posts-list'), 'refresh');

    await waitFor(() =>
      expect(useFavoritesStore.getState().favorites[1]?.post.title).toBe('Edited'),
    );
    // List responses carry no Comments, so the ones saved from the detail are kept.
    expect(useFavoritesStore.getState().favorites[1]?.comments).toEqual(comments);
    expect(Object.keys(useFavoritesStore.getState().favorites)).toEqual(['1']);
  });
});
