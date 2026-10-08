import { PostIdParamSchema, type PostId } from '../../model';

export function parsePostId(param: string | string[] | undefined): PostId | null {
  const result = PostIdParamSchema.safeParse(param);
  return result.success ? result.data : null;
}
