import { waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';

import { API_URL, renderHookWithProviders, server } from '@/test';

import { usePostDetail } from './usePostDetail';

describe('usePostDetail', () => {
  it('loads the Post with its Comments', async () => {
    const { result } = await renderHookWithProviders(() => usePostDetail(2));

    expect(result.current.detail).toBeUndefined();
    await waitFor(() => expect(result.current.detail?.title).toBe('Post 2'));
    expect(result.current.detail?.comments).toHaveLength(2);
  });

  it('reports a failed request as an error, not as not found', async () => {
    server.use(http.get(`${API_URL}/posts/:id`, () => new HttpResponse(null, { status: 500 })));

    const { result } = await renderHookWithProviders(() => usePostDetail(2));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isNotFound).toBe(false);
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
    expect(requests).toEqual([]);
  });
});
