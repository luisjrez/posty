import type { AppIconBadgeConfig } from 'app-icon-badge/types';

import type { VariantConfig } from './variants';

export function iconBadge(badge: VariantConfig['badge']): AppIconBadgeConfig {
  return {
    enabled: badge !== null,
    badges: badge ? [{ text: badge.text, type: 'banner', background: badge.background }] : [],
  };
}
