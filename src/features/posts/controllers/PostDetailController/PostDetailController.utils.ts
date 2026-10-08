import type { PostCommentsState } from '../../components/PostComments';
import type { PostDetailState } from '../../components/PostDetail';
import { PostIdParamSchema, type Comment, type Post, type PostId } from '../../model';

export function parsePostId(param: string | string[] | undefined): PostId | null {
  const result = PostIdParamSchema.safeParse(param);
  return result.success ? result.data : null;
}

type DetailInput = {
  post: Post | undefined;
  comments: readonly Comment[] | undefined;
  isNotFound: boolean;
  isError: boolean;
  onRetry: () => void;
};

function commentsState({ comments, isError, onRetry }: DetailInput): PostCommentsState {
  if (comments) return { status: 'ready', comments };
  if (isError) return { status: 'error', onRetry };
  return { status: 'loading' };
}

// Not found wins over a cached Post: the server's word on whether it exists is final. A Post
// already on screen stays there when only its Comments fail.
export function detailState(input: DetailInput): PostDetailState {
  if (input.isNotFound) return { status: 'notFound' };
  if (input.post) return { status: 'ready', post: input.post, comments: commentsState(input) };
  if (input.isError) return { status: 'error', onRetry: input.onRetry };
  return { status: 'loading' };
}
