import { Stack } from 'expo-router';
import { useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';

import { searchBarOptions, stackScreenOptions, type Theme } from '@/design-system';

// Each tab gets its own copy of this stack (and of the shared detail route); `segment`
// tells which tab is rendering it. The list screens live in the single-tab groups.
// The anchor is the screen kept under a deep-linked detail, so back returns to the tab's list.
// The root key covers the first group, `(posts)`; other groups go under their bare name.
export const unstable_settings = {
  anchor: 'index',
  favorites: { anchor: 'favorites' },
};

const LISTS = {
  '(posts)': { route: 'index', title: 'Posts', placeholder: 'Search posts' },
  '(favorites)': { route: 'favorites', title: 'Favorites', placeholder: 'Search favorites' },
};

const DETAIL_OPTIONS = { title: 'Post' };

type TabGroup = keyof typeof LISTS;

function isTabGroup(segment: string): segment is TabGroup {
  return segment in LISTS;
}

function listScreenOptions(theme: Theme, group: TabGroup) {
  const { title, placeholder } = LISTS[group];
  return {
    title,
    headerLargeTitle: true,
    // Large titles force a transparent header on iOS; without a blur the collapsed header
    // shows the list scrolling underneath the title and status bar.
    headerBlurEffect: 'systemChromeMaterial' as const,
    headerSearchBarOptions: searchBarOptions(theme, placeholder),
  };
}

type TabStackLayoutProps = { segment: string };

export default function TabStackLayout({ segment }: TabStackLayoutProps) {
  const { theme } = useUnistyles();
  const group: TabGroup = isTabGroup(segment) ? segment : '(posts)';
  const screenOptions = useMemo(() => stackScreenOptions(theme), [theme]);
  const listOptions = useMemo(() => listScreenOptions(theme, group), [theme, group]);

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name={LISTS[group].route} options={listOptions} />
      <Stack.Screen name="posts/[id]" options={DETAIL_OPTIONS} />
    </Stack>
  );
}
