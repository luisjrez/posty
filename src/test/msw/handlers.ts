import { http, HttpResponse } from 'msw';

import type { Post } from '@/features/posts';

import { buildPost } from '../factories';

export const API_URL = 'https://jsonplaceholder.typicode.com';

export const seedPosts: Post[] = Array.from({ length: 45 }, (_, index) =>
  buildPost({ id: index + 1, title: `Post ${index + 1}` }),
);

function toNumber(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return value !== null && Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const handlers = [
  http.get(`${API_URL}/posts`, ({ request }) => {
    const params = new URL(request.url).searchParams;
    const page = toNumber(params.get('_page'), 1);
    const limit = toNumber(params.get('_limit'), seedPosts.length);
    const titleLike = params.get('title_like');

    let posts = seedPosts;
    if (titleLike !== null) {
      try {
        const pattern = new RegExp(titleLike, 'i');
        posts = posts.filter((post) => pattern.test(post.title));
      } catch {
        return new HttpResponse(null, { status: 500 });
      }
    }

    const start = (page - 1) * limit;
    return HttpResponse.json(posts.slice(start, start + limit), {
      headers: { 'X-Total-Count': String(posts.length) },
    });
  }),
];
