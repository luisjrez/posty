import type { AppVariant } from '../src/config/variant';

import { VARIANTS } from './variants';

const BASE_ICON = './assets/icon.png';

export function badgedIconPath(variant: AppVariant): string {
  return `./assets/variants/${variant}/icon.png`;
}

export function variantIcon(variant: AppVariant): string {
  return VARIANTS[variant].badge === null ? BASE_ICON : badgedIconPath(variant);
}
