import { waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';

import { API_URL, buildPost, createTestQueryClient, renderHookWithProviders, server } from '@/test';

import { postKeys } from '../api/posts.queries';

import { usePostDetail } from './usePostDetail';

function seedListCache(search: string, posts = [buildPost({ id: 2, title: 'Listed post 2' })]) {
  const queryClient = createTestQueryClient();
  queryClient.setQueryData(postKeys.list(search), {
    pages: [{ items: posts, total: posts.length }],
    pageParams: [1],
  });
  return queryClient;
}

describe('usePostDetail', () => {
  it('returns the Post from any cached list page while its Comments load', async () => {
    const queryClient = seedListCache('listed');

    const { result } = await renderHookWithProviders(() => usePostDetail(2), queryClient);

    expect(result.current.post?.title).toBe('Listed post 2');
    expect(result.current.comments).toBeUndefined();
    await waitFor(() => expect(result.current.comments).toHaveLength(2));
    expect(result.current.post?.title).toBe('Post 2');
  });

  it('keeps the cached Post when the detail request fails', async () => {
    server.use(http.get(`${API_URL}/posts/:id`, () => new HttpResponse(null, { status: 500 })));
    const queryClient = seedListCache('');

    const { result } = await renderHookWithProviders(() => usePostDetail(2), queryClient);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.post?.title).toBe('Listed post 2');
    expect(result.current.comments).toBeUndefined();
    expect(result.current.isNotFound).toBe(false);
  });

  it('ignores cache entries that do not hold Posts', async () => {
    const queryClient = seedListCache('', [buildPost({ id: 2 })]);
    queryClient.setQueryData([...postKeys.lists(), { search: 'corrupt' }], { pages: 'nope' });

    const { result } = await renderHookWithProviders(() => usePostDetail(3), queryClient);

    expect(result.current.post).toBeUndefined();
    await waitFor(() => expect(result.current.post?.title).toBe('Post 3'));
  });

  it('flags a 404 as not found', async () => {
    const { result } = await renderHookWithProviders(() => usePostDetail(999));

    await waitFor(() => expect(result.current.isNotFound).toBe(true));
  });

  it('flags a null id as not found without a request', async () => {
    const requests: string[] = [];
    server.events.on('request:start', ({ request }) => requests.push(request.url));

    const { result } = await renderHookWithProviders(() => usePostDetail(null));

    expect(result.current.isNotFound).toBe(true);
    expect(result.current.post).toBeUndefined();
    expect(requests).toEqual([]);
  });
});
