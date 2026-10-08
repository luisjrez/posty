import { mkdirSync } from 'node:fs';
import path from 'node:path';

import { addBadge } from 'app-icon-badge';

import { badgedIconPath, VARIANTS } from '../../app-config';
import { APP_VARIANTS } from '../../src/config/variant';

const ROOT = path.resolve(__dirname, '../..');
const BASE_ICON = path.join(ROOT, 'assets/icon.png');

async function generate(): Promise<void> {
  for (const variant of APP_VARIANTS) {
    const { badge } = VARIANTS[variant];
    if (badge === null) continue;
    const dstPath = path.join(ROOT, badgedIconPath(variant));
    mkdirSync(path.dirname(dstPath), { recursive: true });
    await addBadge({
      icon: BASE_ICON,
      dstPath,
      badges: [{ type: 'banner', text: badge.text, background: badge.background }],
    });
    console.log(`✔ ${path.relative(ROOT, dstPath)}`);
  }
}

void generate();
