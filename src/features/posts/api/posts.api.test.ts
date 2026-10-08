import { http, HttpResponse } from 'msw';

import { ApiError } from '@/shared/api';
import { API_URL, server } from '@/test';

import { postsApi } from './posts.api';

describe('postsApi.list', () => {
  it('returns a page of Posts and the total from X-Total-Count', async () => {
    const result = await postsApi.list({ page: 3 });

    expect(result.total).toBe(45);
    expect(result.items.map((post) => post.id)).toEqual([41, 42, 43, 44, 45]);
  });

  it('sends the search as an escaped title_like', async () => {
    let titleLike: string | null = null;
    server.events.on('request:start', ({ request }) => {
      titleLike = new URL(request.url).searchParams.get('title_like');
    });

    const result = await postsApi.list({ page: 1, search: ' Post (1) ' });

    expect(titleLike).toBe('Post \\(1\\)');
    expect(result).toEqual({ items: [], total: 0 });
  });

  it('maps a server error to an http ApiError', async () => {
    server.use(http.get(`${API_URL}/posts`, () => new HttpResponse(null, { status: 500 })));

    await expect(postsApi.list({ page: 1 })).rejects.toMatchObject({ kind: 'http', status: 500 });
  });

  it('maps an unexpected shape to a parse ApiError', async () => {
    server.use(
      http.get(`${API_URL}/posts`, () =>
        HttpResponse.json([{ id: 'not-a-number' }], { headers: { 'X-Total-Count': '1' } }),
      ),
    );

    const error: unknown = await postsApi.list({ page: 1 }).catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ kind: 'parse' });
  });
});

describe('postsApi.detail', () => {
  it('requests the Post with its Comments embedded in one call', async () => {
    let embed: string | null = null;
    server.events.on('request:start', ({ request }) => {
      embed = new URL(request.url).searchParams.get('_embed');
    });

    const detail = await postsApi.detail({ id: 2 });

    expect(embed).toBe('comments');
    expect(detail.title).toBe('Post 2');
    expect(detail.comments.map((comment) => comment.postId)).toEqual([2, 2]);
  });

  it('maps a missing Post to a 404 ApiError', async () => {
    await expect(postsApi.detail({ id: 999 })).rejects.toMatchObject({
      kind: 'http',
      status: 404,
    });
  });
});

describe('postsApi.byIds', () => {
  it('asks for every id as a repeated query param', async () => {
    let query = '';
    server.events.on('request:start', ({ request }) => {
      query = new URL(request.url).search;
    });

    const posts = await postsApi.byIds({ ids: [3, 1] });

    expect(query).toBe('?id=3&id=1');
    expect(posts.map((post) => post.id).sort()).toEqual([1, 3]);
  });
});
