import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';

import { Text } from '@/shared/components';

import type { PostDetailScreenProps } from './PostDetailScreen.types';
import { styles } from './PostDetailScreen.styles';

// Placeholder: proves the shared detail route is reachable from both tab stacks.
export function PostDetailScreen(_props: PostDetailScreenProps) {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text variant="title">Post {id}</Text>
    </ScrollView>
  );
}
