import { fireEvent, render, screen } from '@testing-library/react-native';

import { buildPost } from '@/test';

import { PostList } from './PostList';
import type { PostListState } from './PostList.types';

function readyState(overrides: Partial<Extract<PostListState, { status: 'ready' }>> = {}) {
  return {
    status: 'ready' as const,
    posts: [],
    footer: { status: 'idle' as const },
    onEndReached: jest.fn(),
    isRefreshing: false,
    onRefresh: jest.fn(),
    ...overrides,
  };
}

describe('PostList', () => {
  it('shows a skeleton while loading', async () => {
    await render(
      <PostList state={{ status: 'loading' }} emptyMessage="" onPressPost={jest.fn()} />,
    );

    expect(screen.getByLabelText('Loading posts')).toBeOnTheScreen();
  });

  it('shows the error with a retry', async () => {
    const onRetry = jest.fn();
    await render(
      <PostList state={{ status: 'error', onRetry }} emptyMessage="" onPressPost={jest.fn()} />,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows the empty message when there are no Posts', async () => {
    await render(
      <PostList state={readyState()} emptyMessage="Nothing here" onPressPost={jest.fn()} />,
    );

    expect(screen.getByText('Nothing here')).toBeOnTheScreen();
  });

  it('renders the Posts and the footer state', async () => {
    const onRetry = jest.fn();
    const state = readyState({
      posts: [buildPost({ title: 'First' })],
      footer: { status: 'loadMoreFailed', onRetry },
    });
    await render(<PostList state={state} emptyMessage="" onPressPost={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'First' })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
