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

export const PostDetailSchema = PostSchema.extend({
  comments: z.array(CommentSchema),
});

// Route params arrive as strings; anything that isn't a positive integer can't name a Post.
export const PostIdParamSchema = z.coerce.number().int().positive();

export type Post = z.infer<typeof PostSchema>;
export type PostId = Post['id'];
export type Comment = z.infer<typeof CommentSchema>;
export type PostDetail = z.infer<typeof PostDetailSchema>;
