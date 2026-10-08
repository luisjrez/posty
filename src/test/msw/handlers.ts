import { http, HttpResponse } from 'msw';

import type { Comment, Post } from '@/features/posts';

import { buildComment, buildPost } from '../factories';

export const API_URL = 'https://jsonplaceholder.typicode.com';

export const seedPosts: Post[] = Array.from({ length: 45 }, (_, index) =>
  buildPost({ id: index + 1, title: `Post ${index + 1}` }),
);

// Two Comments per Post, like a trimmed-down jsonplaceholder.
export function seedComments(postId: number): Comment[] {
  return [1, 2].map((n) =>
    buildComment({ id: postId * 10 + n, postId, name: `Comment ${n} on post ${postId}` }),
  );
}

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
  http.get(`${API_URL}/posts/:id`, ({ params, request }) => {
    const post = seedPosts.find((candidate) => String(candidate.id) === params.id);
    if (!post) return HttpResponse.json({}, { status: 404 });
    const embed = new URL(request.url).searchParams.get('_embed');
    return HttpResponse.json(
      embed === 'comments' ? { ...post, comments: seedComments(post.id) } : post,
    );
  }),
];
