const SCHEME = /^[a-z][a-z\d+.-]*:\/\//i;

// The detail has one route, above the tabs (`/posts/:id`). Links into it through the Favorites
// tab (`favorites/posts/:id`) are kept working by dropping the tab prefix; every other path
// already matches a route, or reaches the router's unmatched screen.
function resolveDeepLink(path: string): string {
  const route = path.replace(SCHEME, '').split(/[?#]/)[0] ?? '';
  const segments = route.split('/').filter(Boolean);
  if (segments[0] === 'favorites' && segments[1] === 'posts' && segments.length === 3) {
    segments.shift();
  }
  return `/${segments.join('/')}`;
}

// Runs for every incoming link, on cold and warm start, outside React. The mapping above is
// pure string work and cannot throw, which this hook requires.
export function redirectSystemPath({ path }: { path: string; initial: boolean }): string {
  return resolveDeepLink(path);
}
