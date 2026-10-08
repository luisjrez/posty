import { useFonts } from 'expo-font';
import { ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';

import { fonts, nativeTabsOptions, toNavigationTheme } from '@/design-system';
import { enableRequestLogging } from '@/shared/api';
import { QueryProvider } from '@/shared/query';

void SplashScreen.preventAutoHideAsync();

if (__DEV__) enableRequestLogging();

const POSTS_ICON = { default: 'doc.text', selected: 'doc.text.fill' } as const;
const FAVORITES_ICON = { default: 'heart', selected: 'heart.fill' } as const;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fonts);
  const { theme, rt } = useUnistyles();
  const isDark = rt.themeName === 'dark';

  const navigationTheme = useMemo(() => toNavigationTheme(theme, isDark), [theme, isDark]);
  const tabsOptions = useMemo(() => nativeTabsOptions(theme), [theme]);
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <QueryProvider>
      <ThemeProvider value={navigationTheme}>
        <NativeTabs {...tabsOptions}>
          <NativeTabs.Trigger name="(posts)">
            <NativeTabs.Trigger.Icon sf={POSTS_ICON} md="article" />
            <NativeTabs.Trigger.Label>Posts</NativeTabs.Trigger.Label>
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="(favorites)">
            <NativeTabs.Trigger.Icon sf={FAVORITES_ICON} md="favorite" />
            <NativeTabs.Trigger.Label>Favorites</NativeTabs.Trigger.Label>
          </NativeTabs.Trigger>
        </NativeTabs>
      </ThemeProvider>
    </QueryProvider>
  );
}
