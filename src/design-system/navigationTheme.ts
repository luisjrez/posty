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
    headerTitleStyle: {
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.text.primary,
    },
    headerLargeTitleStyle: {
      fontFamily: theme.fontFamily.display,
      color: theme.colors.text.primary,
    },
    headerTintColor: theme.colors.accent.default,
    contentStyle: { backgroundColor: theme.colors.bg.canvas },
  };
}

// Native tabs and the header search bar are platform views, so they take plain colors
// instead of a navigation theme; deriving them here keeps them in sync with the tokens.
export function nativeTabsOptions(theme: Theme) {
  return {
    backgroundColor: theme.colors.bg.surface,
    iconColor: theme.colors.text.muted,
    tintColor: theme.colors.accent.default,
    indicatorColor: theme.colors.bg.muted,
    rippleColor: theme.colors.bg.muted,
    labelStyle: {
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text.muted,
    },
    selectedLabelStyle: {
      fontFamily: theme.fontFamily.semibold,
      color: theme.colors.accent.default,
    },
  };
}

export function searchBarOptions(theme: Theme, placeholder: string) {
  return {
    placeholder,
    textColor: theme.colors.text.primary,
    hintTextColor: theme.colors.text.muted,
    headerIconColor: theme.colors.text.secondary,
    tintColor: theme.colors.accent.default,
    barTintColor: theme.colors.bg.muted,
  };
}
