import { Text, View } from 'react-native';

import type { PostsScreenProps } from './PostsScreen.types';
import { styles } from './PostsScreen.styles';

// Placeholder screen: proves the route → feature wiring. Replaced in ticket 04/10.
export function PostsScreen(_props: PostsScreenProps) {
  return (
    <View style={styles.container}>
      <Text>Posty</Text>
    </View>
  );
}
