import type { AppVariant } from '../src/config/variant';

export type VariantConfig = {
  name: string;
  appId: string;
  scheme: string;
  easEnvironment: 'development' | 'preview' | 'production';
  badge: { text: string; background: string } | null;
};

export const VARIANTS: Record<AppVariant, VariantConfig> = {
  development: {
    name: 'Posty (Dev)',
    appId: 'com.luisjuarez.posty.dev',
    scheme: 'posty-dev',
    easEnvironment: 'development',
    badge: { text: 'DEV', background: '#2F6BFF' },
  },
  staging: {
    name: 'Posty (Stage)',
    appId: 'com.luisjuarez.posty.stage',
    scheme: 'posty-stage',
    easEnvironment: 'preview',
    badge: { text: 'STAGE', background: '#F08C00' },
  },
  production: {
    name: 'Posty',
    appId: 'com.luisjuarez.posty',
    scheme: 'posty',
    easEnvironment: 'production',
    badge: null,
  },
};
