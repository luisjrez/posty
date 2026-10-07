import { copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';

import { APP_VARIANTS, type AppVariant } from '../../src/config/variant';

// Usage: bun scripts/env/use.ts <variant>
// Copies env/<variant>.env to the root .env, the only file Expo CLI and app.config.ts read.
const ROOT = path.resolve(__dirname, '../..');

function isAppVariant(value: string | undefined): value is AppVariant {
  return APP_VARIANTS.some((variant) => variant === value);
}

const variant = process.argv[2];
if (!isAppVariant(variant)) {
  console.error(`Usage: bun run env:use <${APP_VARIANTS.join('|')}>`);
  process.exit(1);
}

const source = path.join(ROOT, 'env', `${variant}.env`);
if (!existsSync(source)) {
  console.error(`Missing env file: env/${variant}.env`);
  process.exit(1);
}

copyFileSync(source, path.join(ROOT, '.env'));
console.log(`✔ .env ← env/${variant}.env`);
