import type { Comment } from '../../model';

export type PostCommentsProps = {
  /** Undefined when the Comments were never saved for offline reading. */
  comments: readonly Comment[] | undefined;
};
