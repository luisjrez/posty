export const APP_VARIANTS = ['development', 'staging', 'production'] as const;

export type AppVariant = (typeof APP_VARIANTS)[number];
