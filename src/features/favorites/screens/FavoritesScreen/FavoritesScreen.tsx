import { ScrollView } from 'react-native';

import { Text } from '@/shared/components';

import type { FavoritesScreenProps } from './FavoritesScreen.types';
import { styles } from './FavoritesScreen.styles';

// Placeholder until the Favorites list lands; a ScrollView keeps the large title and
// native tab bar behaving as they will with the real list.
export function FavoritesScreen(_props: FavoritesScreenProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text color="muted">No favorites yet</Text>
    </ScrollView>
  );
}
