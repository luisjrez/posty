const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Short and coarse on purpose: it labels how stale saved content is, not an exact time.
// Future timestamps (clock skew) read as "just now".
export function formatTimeAgo(timestamp: number, now: number = Date.now()): string {
  const elapsed = now - timestamp;
  if (elapsed < MINUTE) return 'just now';
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)} min ago`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)} h ago`;
  return `${Math.floor(elapsed / DAY)} d ago`;
}
