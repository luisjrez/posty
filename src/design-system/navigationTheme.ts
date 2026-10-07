import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from 'expo-router';

import type { Theme } from './generated/themes';

export function toNavigationTheme(theme: Theme, isDark: boolean): NavigationTheme {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    dark: isDark,
    colors: {
      primary: theme.colors.accent.default,
      background: theme.colors.bg.canvas,
      card: theme.colors.bg.surface,
      text: theme.colors.text.primary,
      border: theme.colors.border.subtle,
      notification: theme.colors.accent.default,
    },
    fonts: {
      regular: { fontFamily: theme.fontFamily.regular, fontWeight: '400' },
      medium: { fontFamily: theme.fontFamily.medium, fontWeight: '500' },
      bold: { fontFamily: theme.fontFamily.semibold, fontWeight: '600' },
      heavy: { fontFamily: theme.fontFamily.bold, fontWeight: '700' },
    },
  };
}

export function stackScreenOptions(theme: Theme) {
  return {
    headerTitleStyle: { fontFamily: theme.fontFamily.semibold, color: theme.colors.text.primary },
    headerLargeTitleStyle: {
      fontFamily: theme.fontFamily.display,
      color: theme.colors.text.primary,
    },
    headerTintColor: theme.colors.accent.default,
    contentStyle: { backgroundColor: theme.colors.bg.canvas },
  };
}
