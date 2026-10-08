import { resolveDeepLink } from '@/shared/lib';

// Runs outside React for every incoming link (cold and warm start) and must never throw.
export function redirectSystemPath({ path }: { path: string; initial: boolean }): string {
  try {
    return resolveDeepLink(path);
  } catch {
    return '/';
  }
}
