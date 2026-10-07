import { z } from 'zod';

export const PostSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  title: z.string(),
  body: z.string(),
});

export const CommentSchema = z.object({
  id: z.number().int(),
  postId: z.number().int(),
  name: z.string(),
  email: z.string(),
  body: z.string(),
});

export type Post = z.infer<typeof PostSchema>;
export type PostId = Post['id'];
export type Comment = z.infer<typeof CommentSchema>;
