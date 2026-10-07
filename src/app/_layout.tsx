import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';

import { fonts, stackScreenOptions, toNavigationTheme } from '@/design-system';

void SplashScreen.preventAutoHideAsync();

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
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={screenOptions} />
    </ThemeProvider>
  );
}
