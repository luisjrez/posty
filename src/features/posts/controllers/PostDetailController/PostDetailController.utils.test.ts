import { buildComment, buildPost } from '@/test';

import { detailState, parsePostId } from './PostDetailController.utils';

const onRetry = jest.fn();
const post = buildPost({ id: 1 });
const base = { post: undefined, comments: undefined, isNotFound: false, isError: false, onRetry };

describe('parsePostId', () => {
  it.each([
    ['7', 7],
    ['abc', null],
    ['0', null],
    ['1.5', null],
    [undefined, null],
  ])('parses %p as %p', (param, expected) => {
    expect(parsePostId(param)).toBe(expected);
  });
});

describe('detailState', () => {
  it('is loading while nothing is known', () => {
    expect(detailState(base)).toEqual({ status: 'loading' });
  });

  it('is not found even when a cached Post exists', () => {
    expect(detailState({ ...base, post, isNotFound: true })).toEqual({ status: 'notFound' });
  });

  it('is an error with retry when no Post is available', () => {
    expect(detailState({ ...base, isError: true })).toEqual({ status: 'error', onRetry });
  });

  it('shows the Post with loading Comments', () => {
    expect(detailState({ ...base, post })).toEqual({
      status: 'ready',
      post,
      comments: { status: 'loading' },
    });
  });

  it('shows the Post with a Comments error when the request failed', () => {
    expect(detailState({ ...base, post, isError: true })).toEqual({
      status: 'ready',
      post,
      comments: { status: 'error', onRetry },
    });
  });

  it('shows the Post with its Comments', () => {
    const comments = [buildComment()];
    expect(detailState({ ...base, post, comments })).toEqual({
      status: 'ready',
      post,
      comments: { status: 'ready', comments },
    });
  });
});
