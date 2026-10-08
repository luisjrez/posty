import type { Post } from '../../model';

export function keyExtractor(post: Post): string {
  return String(post.id);
}
