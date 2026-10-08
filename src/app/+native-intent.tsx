const SCHEME = /^[a-z][a-z\d+.-]*:\/\//i;

// Public links name the tab in the path (`favorites/posts/42`), but both tabs share one detail
// route whose URL has no tab in it; the route group picks the tab instead. Anything unknown is
// passed through so the router can show its unmatched screen.
function resolveDeepLink(path: string): string {
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

// Runs for every incoming link, on cold and warm start, outside React. The mapping above is
// pure string work and cannot throw, which this hook requires.
export function redirectSystemPath({ path }: { path: string; initial: boolean }): string {
  return resolveDeepLink(path);
}
