import { loadProjectEnv } from '@expo/env';
import { z } from 'zod';

import { APP_VARIANTS } from '../src/config/variant';

const BuildEnvSchema = z.object({
  APP_VARIANT: z.enum(APP_VARIANTS),
  API_URL: z.url(),
});

export type BuildEnv = z.infer<typeof BuildEnvSchema>;

export function parseBuildEnv(source: unknown): BuildEnv {
  const result = BuildEnvSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid build env:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export function readBuildEnv(projectRoot: string): BuildEnv {
  loadProjectEnv(projectRoot, { silent: true });
  return parseBuildEnv(process.env);
}
