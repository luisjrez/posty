import { redirectSystemPath } from '@/app/+native-intent';

function resolve(path: string) {
  return redirectSystemPath({ path, initial: true });
}

describe('redirectSystemPath', () => {
  it.each([
    ['posty://posts/42', '/posts/42'],
    ['posty-stage://posts/42', '/posts/42'],
    ['posty-dev://favorites', '/favorites'],
    ['posty://favorites/', '/favorites'],
    ['posty://favorites/posts/42', '/posts/42'],
    ['/favorites/posts/42', '/posts/42'],
    ['posts/42?utm=x#top', '/posts/42'],
    ['posty://posts/abc', '/posts/abc'],
    ['posty://', '/'],
    ['', '/'],
  ])('maps %p to %p', (path, expected) => {
    expect(resolve(path)).toBe(expected);
  });

  it('leaves unknown paths for the router to report as unmatched', () => {
    expect(resolve('posty://settings')).toBe('/settings');
  });
});
