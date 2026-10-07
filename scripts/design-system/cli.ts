import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { applyDesignSystem, DesignSystemError } from './applyDesignSystem';

const ROOT = path.resolve(__dirname, '../..');
const OUT_DIR = path.join(ROOT, 'src/design-system/generated');

function readArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function currentDesignSystem(): string | undefined {
  const meta = path.join(OUT_DIR, 'meta.json');
  if (!existsSync(meta)) return undefined;
  const parsed: unknown = JSON.parse(readFileSync(meta, 'utf8'));
  return typeof parsed === 'object' &&
    parsed !== null &&
    'name' in parsed &&
    typeof parsed.name === 'string'
    ? parsed.name
    : undefined;
}

async function main() {
  const check = process.argv.includes('--check');
  const name = readArg('ds') ?? (check ? currentDesignSystem() : undefined);
  if (!name) {
    console.error('Missing --ds=<name> (e.g. --ds=posty)');
    process.exit(1);
  }

  try {
    const result = await applyDesignSystem({
      designSystemsDir: path.join(ROOT, 'design-systems'),
      name,
      outDir: OUT_DIR,
      fontsDir: path.join(ROOT, 'assets/fonts'),
      check,
    });
    console.log(`✔ design system "${name}": ${result.status} (${result.files.join(', ')})`);
  } catch (error) {
    if (error instanceof DesignSystemError) {
      console.error(`✖ ${error.message}`);
      process.exit(1);
    }
    throw error;
  }
}

void main();
