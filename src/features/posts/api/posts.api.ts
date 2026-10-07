import { requestPaginated } from '@/shared/api';
import { escapeRegExp } from '@/shared/lib';

import { PostSchema } from '../model';

export const POSTS_PAGE_SIZE = 20;

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
};
