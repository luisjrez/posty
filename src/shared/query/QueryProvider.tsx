import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';

import { createQueryClient } from './queryClient';
import { setupQueryManagers } from './queryManagers';

type QueryProviderProps = { children: ReactNode };

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(createQueryClient);

  useEffect(setupQueryManagers, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
