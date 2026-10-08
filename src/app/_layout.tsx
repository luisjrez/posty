import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';

import { fonts, stackScreenOptions, toNavigationTheme } from '@/design-system';
import { enableRequestLogging } from '@/shared/api';
import { QueryProvider } from '@/shared/query';

void SplashScreen.preventAutoHideAsync();

if (__DEV__) enableRequestLogging();

// A deep link opened on a cold start would otherwise mount the Post detail alone, with no tabs
// and nothing to go back to; anchoring the stack keeps the tabs underneath it.
export const unstable_settings = { anchor: '(tabs)' };

// Each tab owns its header; the root stack only lets the Post detail sit above the tabs.
const TABS_OPTIONS = { headerShown: false };
// The detail can be reached from either tab, so a bare chevron reads right in both; the hidden
// back title still names the button for screen readers.
const DETAIL_OPTIONS: {
  title: string;
  headerBackButtonDisplayMode: 'minimal';
  headerBackTitle: string;
} = { title: 'Post', headerBackButtonDisplayMode: 'minimal', headerBackTitle: 'Back' };

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fonts);
  const { theme, rt } = useUnistyles();
  const isDark = rt.themeName === 'dark';

  const navigationTheme = useMemo(() => toNavigationTheme(theme, isDark), [theme, isDark]);
  const screenOptions = useMemo(() => stackScreenOptions(theme), [theme]);
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <QueryProvider>
      <ThemeProvider value={navigationTheme}>
        <Stack screenOptions={screenOptions}>
          <Stack.Screen name="(tabs)" options={TABS_OPTIONS} />
          <Stack.Screen name="posts/[id]" options={DETAIL_OPTIONS} />
        </Stack>
      </ThemeProvider>
    </QueryProvider>
  );
}
