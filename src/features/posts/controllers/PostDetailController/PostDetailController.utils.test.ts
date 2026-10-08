import { buildComment, buildPost } from '@/test';

import { detailState, parsePostId } from './PostDetailController.utils';

const onRetry = jest.fn();
const detail = { ...buildPost({ id: 1 }), comments: [buildComment({ postId: 1 })] };
const base = { detail: undefined, isNotFound: false, isError: false, onRetry };

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

  it('is not found when the server says so', () => {
    expect(detailState({ ...base, isNotFound: true })).toEqual({ status: 'notFound' });
  });

  it('is an error with retry when there is no Post to show', () => {
    expect(detailState({ ...base, isError: true })).toEqual({ status: 'error', onRetry });
  });

  it('shows the Post with its Comments', () => {
    expect(detailState({ ...base, detail })).toEqual({ status: 'ready', detail });
  });

  it('keeps showing a cached Post when a background refetch fails', () => {
    expect(detailState({ ...base, detail, isError: true })).toEqual({ status: 'ready', detail });
  });
});
