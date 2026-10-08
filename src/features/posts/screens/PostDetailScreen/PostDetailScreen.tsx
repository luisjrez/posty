import { PostDetailController } from '../../controllers/PostDetailController';

import type { PostDetailScreenProps } from './PostDetailScreen.types';

// The screen only places the controller; state, data and navigation live there.
export function PostDetailScreen(_props: PostDetailScreenProps) {
  return <PostDetailController />;
}
