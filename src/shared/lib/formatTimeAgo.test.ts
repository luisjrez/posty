import { formatTimeAgo } from './formatTimeAgo';

const NOW = new Date('2026-10-08T12:00:00Z').getTime();
const MINUTE = 60_000;

describe('formatTimeAgo', () => {
  it.each([
    [NOW - 20_000, 'just now'],
    [NOW + 5_000, 'just now'],
    [NOW - MINUTE, '1 min ago'],
    [NOW - 59 * MINUTE, '59 min ago'],
    [NOW - 60 * MINUTE, '1 h ago'],
    [NOW - 23 * 60 * MINUTE, '23 h ago'],
    [NOW - 24 * 60 * MINUTE, '1 d ago'],
    [NOW - 10 * 24 * 60 * MINUTE, '10 d ago'],
  ])('formats %p as %p', (timestamp, expected) => {
    expect(formatTimeAgo(timestamp, NOW)).toBe(expected);
  });
});
