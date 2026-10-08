import { View } from 'react-native';

import { Text } from '../Text';

import { styles } from './EmptyState.styles';
import type { EmptyStateProps } from './EmptyState.types';

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="title" align="center">
        {title}
      </Text>
      {message ? (
        <Text color="secondary" align="center">
          {message}
        </Text>
      ) : null}
    </View>
  );
}
