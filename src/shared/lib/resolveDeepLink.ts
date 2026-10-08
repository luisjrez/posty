const SCHEME = /^[a-z][a-z\d+.-]*:\/\//i;

// Public links name the tab in the path (`favorites/posts/42`), but both tabs share one detail
// route whose URL has no tab in it; the route group picks the tab instead. Anything unknown is
// passed through so the router can show its unmatched screen.
export function resolveDeepLink(path: string): string {
  const route = path.replace(SCHEME, '').split(/[?#]/)[0] ?? '';
  const segments = route.split('/').filter(Boolean);
  const [first, second, third] = segments;

  if (first === 'favorites' && second === 'posts' && third !== undefined && segments.length === 3) {
    return `/(favorites)/posts/${third}`;
  }
  if (first === 'posts' && second !== undefined && segments.length === 2) {
    return `/(posts)/posts/${second}`;
  }
  return `/${segments.join('/')}`;
}
