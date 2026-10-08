import { resolveDeepLink } from './resolveDeepLink';

describe('resolveDeepLink', () => {
  it.each([
    ['posty://posts/42', '/(posts)/posts/42'],
    ['posty-stage://posts/42', '/(posts)/posts/42'],
    ['posty-dev://favorites', '/favorites'],
    ['posty://favorites/', '/favorites'],
    ['posty://favorites/posts/42', '/(favorites)/posts/42'],
    ['/favorites/posts/42', '/(favorites)/posts/42'],
    ['posts/42?utm=x#top', '/(posts)/posts/42'],
    ['posty://posts/abc', '/(posts)/posts/abc'],
    ['posty://', '/'],
    ['', '/'],
  ])('maps %p to %p', (path, expected) => {
    expect(resolveDeepLink(path)).toBe(expected);
  });

  it('leaves unknown paths for the router to report as unmatched', () => {
    expect(resolveDeepLink('posty://settings')).toBe('/settings');
  });
});
