import { View } from 'react-native';

import { Button } from '../Button';
import { Text } from '../Text';

import { styles } from './EmptyState.styles';
import type { EmptyStateProps } from './EmptyState.types';

export function EmptyState({ title, message, action }: EmptyStateProps) {
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
      {action ? <Button label={action.label} onPress={action.onPress} /> : null}
    </View>
  );
}
