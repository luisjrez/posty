import { http, HttpResponse } from 'msw';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { Text } from '@/shared/components';
import { API_URL, renderScreenInStack, server } from '@/test';

import { PostsListController } from '../PostsListController';

import { PostDetailController } from './PostDetailController';

// Routes render without props; the controllers' props types forbid any.
function PostsRoute() {
  return <PostsListController />;
}

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

// Holds the detail response until released, so the in-between state can be asserted.
function holdDetailResponse() {
  let release: () => void = () => {};
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  server.use(
    http.get(`${API_URL}/posts/:id`, async () => {
      await released;
      return undefined;
    }),
  );
  return release;
}

describe('PostDetailController', () => {
  it('paints the Post from the list cache before its Comments arrive', async () => {
    await renderScreenInStack(PostsRoute, { 'posts/[id]': DetailRoute });
    const card = await screen.findByRole('button', { name: 'Post 2' });
    const release = holdDetailResponse();

    await fireEvent.press(card);

    expect(await screen.findByText('Body of post 2')).toBeOnTheScreen();
    expect(screen.getByLabelText('Loading comments')).toBeOnTheScreen();

    await act(async () => release());

    expect(await screen.findByText('Comment 1 on post 2')).toBeOnTheScreen();
  });

  it('loads the Post with its Comments when nothing is cached', async () => {
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

  it('keeps the cached Post on screen and offers a retry when its Comments fail', async () => {
    await renderScreenInStack(PostsRoute, { 'posts/[id]': DetailRoute });
    const card = await screen.findByRole('button', { name: 'Post 5' });
    server.use(http.get(`${API_URL}/posts/:id`, () => new HttpResponse(null, { status: 500 })));

    await fireEvent.press(card);

    expect(await screen.findByText('Could not load comments')).toBeOnTheScreen();
    expect(screen.getByText('Body of post 5')).toBeOnTheScreen();

    server.resetHandlers();
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Comment 1 on post 5')).toBeOnTheScreen();
  });
});
