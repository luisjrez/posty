import { buildComment, buildPost } from '@/test';

import { detailState, parsePostId, toSnapshotInput } from './PostDetailController.utils';

const onRetry = jest.fn();
const onGoBack = jest.fn();
const post = buildPost({ id: 1 });
const comments = [buildComment({ postId: 1 })];
const detail = { ...post, comments };
const savedCopy = { post: buildPost({ id: 1, title: 'Saved' }), savedAt: 1, syncedAt: 2 };
const base = {
  detail: undefined,
  isNotFound: false,
  isError: false,
  isOnline: true,
  fetchedAt: 5,
  savedCopy: undefined,
  onRetry,
  onGoBack,
};

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
    expect(detailState({ ...base, isNotFound: true })).toEqual({ status: 'notFound', onGoBack });
  });

  it('is an error with retry when there is no Post to show', () => {
    expect(detailState({ ...base, isError: true })).toEqual({ status: 'error', onRetry });
  });

  it('shows the Post with its Comments', () => {
    expect(detailState({ ...base, detail })).toEqual({ status: 'ready', post, comments });
  });

  it('keeps showing a cached Post when a background refetch fails', () => {
    expect(detailState({ ...base, detail, isError: true })).toEqual({
      status: 'ready',
      post,
      comments,
    });
  });

  it('prefers fetched data over the saved copy offline, flagged with its fetch time', () => {
    expect(detailState({ ...base, detail, isOnline: false, savedCopy })).toEqual({
      status: 'ready',
      post,
      comments,
      offlineUpdatedAt: 5,
    });
  });

  it('falls back to the saved copy offline, flagged with its sync time', () => {
    expect(detailState({ ...base, isOnline: false, savedCopy })).toEqual({
      status: 'ready',
      post: savedCopy.post,
      comments: undefined,
      offlineUpdatedAt: 2,
    });
  });

  it('ignores the saved copy online, where the skeleton is shown until the fetch lands', () => {
    expect(detailState({ ...base, savedCopy })).toEqual({ status: 'loading' });
  });

  it('is an error offline when nothing is saved', () => {
    expect(detailState({ ...base, isOnline: false })).toEqual({ status: 'error', onRetry });
  });
});

describe('toSnapshotInput', () => {
  it('splits the Comments from the Post', () => {
    expect(toSnapshotInput(detail)).toEqual({ post, comments });
  });
});
