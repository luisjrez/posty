import { loadProjectEnv } from '@expo/env';
import { z } from 'zod';

import { APP_VARIANTS } from '../src/config/variant';

const BuildEnvSchema = z.object({
  APP_VARIANT: z.enum(APP_VARIANTS).default('development'),
  API_URL: z.url().optional(),
});

const EasBuildEnvSchema = BuildEnvSchema.extend({ API_URL: z.url() });

export type BuildEnv = z.infer<typeof BuildEnvSchema>;

function isEasBuild(source: unknown): boolean {
  return z.object({ EAS_BUILD: z.literal('true') }).safeParse(source).success;
}

export function parseBuildEnv(source: unknown): BuildEnv {
  const schema = isEasBuild(source) ? EasBuildEnvSchema : BuildEnvSchema;
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid build env:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export function readBuildEnv(projectRoot: string): BuildEnv {
  loadProjectEnv(projectRoot, { silent: true });
  return parseBuildEnv(process.env);
}
