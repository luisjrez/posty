import { request, requestPaginated } from '@/shared/api';
import { escapeRegExp } from '@/shared/lib';

import { PostDetailSchema, PostSchema, type PostId } from '../model';

export const POSTS_PAGE_SIZE = 20;

type DetailParams = {
  id: PostId;
  signal?: AbortSignal | undefined;
};

type ListParams = {
  page: number;
  search?: string | undefined;
  signal?: AbortSignal | undefined;
};

export const postsApi = {
  list({ page, search, signal }: ListParams) {
    const term = search?.trim();
    return requestPaginated(PostSchema, {
      url: '/posts',
      params: {
        _page: page,
        _limit: POSTS_PAGE_SIZE,
        ...(term ? { title_like: escapeRegExp(term) } : {}),
      },
      signal,
    });
  },

  // Comments ride along with the Post so the detail is one request and one cache entry.
  detail({ id, signal }: DetailParams) {
    return request(PostDetailSchema, {
      url: `/posts/${id}`,
      params: { _embed: 'comments' },
      signal,
    });
  },
};
