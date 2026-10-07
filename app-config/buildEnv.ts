import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { loadProjectEnv, parseEnv } from '@expo/env';
import { z } from 'zod';

import { APP_VARIANTS, type AppVariant } from '../src/config/variant';

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

function isAppVariant(value: string | undefined): value is AppVariant {
  return APP_VARIANTS.some((variant) => variant === value);
}

function readVariantFile(
  projectRoot: string,
  variant: string | undefined,
): ReturnType<typeof parseEnv> {
  if (!isAppVariant(variant)) return {};
  const file = path.join(projectRoot, 'env', `${variant}.env`);
  return existsSync(file) ? parseEnv(readFileSync(file, 'utf8')) : {};
}

export function readBuildEnv(projectRoot: string): BuildEnv {
  loadProjectEnv(projectRoot, { silent: true });
  const variantValues = readVariantFile(projectRoot, process.env.APP_VARIANT);
  return parseBuildEnv({ ...variantValues, ...process.env });
}
