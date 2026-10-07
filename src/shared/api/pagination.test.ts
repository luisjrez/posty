import { getNextPageParam } from './pagination';

const page = (size: number, total: number) => ({ items: Array.from({ length: size }), total });

describe('getNextPageParam', () => {
  it('asks for the next page while items are missing', () => {
    expect(getNextPageParam([page(20, 45)], 1)).toBe(2);
    expect(getNextPageParam([page(20, 45), page(20, 45)], 2)).toBe(3);
  });

  it('stops once every item is loaded', () => {
    expect(getNextPageParam([page(20, 45), page(20, 45), page(5, 45)], 3)).toBeUndefined();
    expect(getNextPageParam([page(20, 20)], 1)).toBeUndefined();
  });

  it('stops on an empty page', () => {
    expect(getNextPageParam([page(0, 0)], 1)).toBeUndefined();
  });
});
