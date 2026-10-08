import { Stack } from 'expo-router';
import { useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';

import { listScreenOptions, stackScreenOptions } from '@/design-system';

// Each tab keeps its own stack for its themed header and native search bar.
export default function FavoritesLayout() {
  const { theme } = useUnistyles();
  const screenOptions = useMemo(() => stackScreenOptions(theme), [theme]);
  const listOptions = useMemo(
    () => listScreenOptions(theme, 'Favorites', 'Search favorites'),
    [theme],
  );

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={listOptions} />
    </Stack>
  );
}
