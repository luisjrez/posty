import { useEffect, useState } from 'react';

// Publishes `value` only after it stops changing for `delayMs`, so fast typing doesn't
// trigger a request per keystroke.
export function useDebouncedValue<Value>(value: Value, delayMs: number): Value {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
