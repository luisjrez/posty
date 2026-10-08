import 'tsx/cjs';

import type { ConfigContext, ExpoConfig } from 'expo/config';

import { readBuildEnv, VARIANTS, variantIcon } from './app-config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const { APP_VARIANT, API_URL } = readBuildEnv(__dirname);
  const variant = VARIANTS[APP_VARIANT];

  return {
    ...config,
    version: '1.0.0',
    owner: 'manueljf',
    name: variant.name,
    slug: 'posty',
    scheme: variant.scheme,
    ios: { ...config.ios, supportsTablet: true, bundleIdentifier: variant.appId },
    android: {
      ...config.android,
      package: variant.appId,
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    orientation: 'portrait',
    icon: variantIcon(APP_VARIANT),
    userInterfaceStyle: 'automatic',
    web: { favicon: './assets/favicon.png' },
    plugins: [
      ...(config.plugins ?? []),
      ['expo-dev-client', { addGeneratedScheme: false }],
      'expo-router',
      'expo-status-bar',
      'expo-font',
      'expo-splash-screen',
    ],
    experiments: { typedRoutes: true },
    extra: {
      ...config.extra,
      variant: APP_VARIANT,
      apiUrl: API_URL,
      eas: {
        projectId: '7953d440-c5ed-4362-b348-d003217591b6',
      },
    },
    buildCacheProvider: 'eas',
  };
};
