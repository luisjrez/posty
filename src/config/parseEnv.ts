import { z } from 'zod';

import { APP_VARIANTS } from './variant';

export const EnvSchema = z.object({
  variant: z.enum(APP_VARIANTS),
  apiUrl: z.url(),
});

export type Env = z.infer<typeof EnvSchema>;

export function parseEnv(extra: unknown): Env {
  const result = EnvSchema.safeParse(extra);
  if (!result.success) {
    throw new Error(`Invalid app config extra:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
