import type { Post } from '../../model';

export type PostCardProps = {
  post: Post;
  onPress: (post: Post) => void;
};
