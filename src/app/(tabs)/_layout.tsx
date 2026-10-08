import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';

import { nativeTabsOptions } from '@/design-system';

const POSTS_ICON = { default: 'doc.text', selected: 'doc.text.fill' } as const;
const FAVORITES_ICON = { default: 'heart', selected: 'heart.fill' } as const;

export default function TabsLayout() {
  const { theme } = useUnistyles();
  const tabsOptions = useMemo(() => nativeTabsOptions(theme), [theme]);

  return (
    <NativeTabs {...tabsOptions}>
      <NativeTabs.Trigger name="(posts)">
        <NativeTabs.Trigger.Icon sf={POSTS_ICON} md="article" />
        <NativeTabs.Trigger.Label>Posts</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <NativeTabs.Trigger.Icon sf={FAVORITES_ICON} md="favorite" />
        <NativeTabs.Trigger.Label>Favorites</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
