import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import path from 'node:path';

import { VARIANTS } from '../../app-config/variants';
import { APP_VARIANTS, type AppVariant } from '../../src/config/variant';

// Usage: bun scripts/env/use.ts <variant>
// Pulls the variant's EAS environment into the root .env, the only file Expo CLI and app.config.ts read.
const ROOT = path.resolve(__dirname, '../..');
const ENV_FILE = path.join(ROOT, '.env');

function isAppVariant(value: string | undefined): value is AppVariant {
  return APP_VARIANTS.some((variant) => variant === value);
}

const variant = process.argv[2];
if (!isAppVariant(variant)) {
  console.error(`Usage: bun run env:use <${APP_VARIANTS.join('|')}>`);
  process.exit(1);
}

const environment = VARIANTS[variant].easEnvironment;
execFileSync(
  'bunx',
  ['eas-cli', 'env:pull', '--environment', environment, '--path', ENV_FILE, '--non-interactive'],
  { cwd: ROOT, stdio: 'inherit' },
);
appendFileSync(ENV_FILE, `\nAPP_VARIANT=${variant}\n`);
console.log(`✔ .env ← EAS "${environment}" environment (APP_VARIANT=${variant})`);
