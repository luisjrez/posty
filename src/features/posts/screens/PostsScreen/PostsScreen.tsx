import { PostsListController } from '../../controllers/PostsListController';

import type { PostsScreenProps } from './PostsScreen.types';

// The screen only places the controller; state, data and navigation live there.
export function PostsScreen(_props: PostsScreenProps) {
  return <PostsListController />;
}
