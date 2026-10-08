import { onlineManager } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-native';

import { useIsOnline } from './useIsOnline';

afterEach(() => onlineManager.setOnline(true));

describe('useIsOnline', () => {
  it('follows the query online manager', async () => {
    const { result } = await renderHook(() => useIsOnline());
    expect(result.current).toBe(true);

    await act(() => onlineManager.setOnline(false));

    expect(result.current).toBe(false);
  });
});
