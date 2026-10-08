import { existsSync } from 'node:fs';
import path from 'node:path';

import { APP_VARIANTS } from '../src/config/variant';

import { variantIcon } from './icons';

const ROOT = path.resolve(__dirname, '..');

describe('variantIcon', () => {
  it('keeps the base icon for the production variant', () => {
    expect(variantIcon('production')).toBe('./assets/icon.png');
  });

  it('uses the badged icon for the other variants', () => {
    expect(variantIcon('staging')).toBe('./assets/variants/staging/icon.png');
  });

  it.each(APP_VARIANTS)('points %s at an icon that exists on disk', (variant) => {
    expect(existsSync(path.join(ROOT, variantIcon(variant)))).toBe(true);
  });
});
