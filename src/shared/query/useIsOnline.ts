import { onlineManager } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  return onlineManager.subscribe(onChange);
}

function getSnapshot() {
  return onlineManager.isOnline();
}

// Reads the same signal that pauses queries (wired to NetInfo in setupQueryManagers), so the
// UI's idea of "offline" never disagrees with whether requests are actually being sent.
export function useIsOnline(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot);
}
