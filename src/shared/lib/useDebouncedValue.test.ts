import { act, renderHook } from '@testing-library/react-native';

import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('only publishes the latest value once it has been stable for the delay', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'a' } },
    );
    expect(result.current).toBe('a');

    await rerender({ value: 'ab' });
    await act(() => jest.advanceTimersByTime(200));
    await rerender({ value: 'abc' });
    await act(() => jest.advanceTimersByTime(200));
    expect(result.current).toBe('a');

    await act(() => jest.advanceTimersByTime(100));
    expect(result.current).toBe('abc');
  });
});
