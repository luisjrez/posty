import { act, waitFor } from '@testing-library/react-native';

import { renderHookWithProviders } from '@/test';

import { usePostsList } from './usePostsList';

describe('usePostsList', () => {
  it('loads 20 Posts per page until the total is reached', async () => {
    const { result } = await renderHookWithProviders(() => usePostsList());

    await waitFor(() => expect(result.current.data?.posts).toHaveLength(20));
    expect(result.current.data?.total).toBe(45);
    expect(result.current.hasNextPage).toBe(true);

    await act(() => result.current.fetchNextPage());
    await act(() => result.current.fetchNextPage());

    expect(result.current.data?.posts).toHaveLength(45);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('filters by title on the server', async () => {
    const { result } = await renderHookWithProviders(() => usePostsList('post 4'));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.posts.map((post) => post.title)).toEqual([
      'Post 4',
      'Post 40',
      'Post 41',
      'Post 42',
      'Post 43',
      'Post 44',
      'Post 45',
    ]);
  });
});
