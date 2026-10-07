import type { Comment, Post } from '@/features/posts';

let nextId = 1;

export function buildPost(overrides: Partial<Post> = {}): Post {
  const id = overrides.id ?? nextId++;
  return { id, userId: 1, title: `Post ${id}`, body: `Body of post ${id}`, ...overrides };
}

export function buildComment(overrides: Partial<Comment> = {}): Comment {
  const id = overrides.id ?? nextId++;
  return {
    id,
    postId: 1,
    name: `Comment ${id}`,
    email: `user${id}@example.com`,
    body: `Body of comment ${id}`,
    ...overrides,
  };
}
