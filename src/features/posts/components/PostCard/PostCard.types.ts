import type { ReactNode } from 'react';

import type { Post } from '../../model';

export type PostCardProps = {
  post: Post;
  onPress: (post: Post) => void;
  /** Rendered beside the card's content, outside its press area (e.g. a Favorite toggle). */
  accessory?: ReactNode;
};
