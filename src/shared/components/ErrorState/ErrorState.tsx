import { View } from 'react-native';

import { Button } from '../Button';
import { Text } from '../Text';

import { styles } from './ErrorState.styles';
import type { ErrorStateProps } from './ErrorState.types';

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="title" align="center" accessibilityRole="alert">
        {title}
      </Text>
      {message ? (
        <Text color="secondary" align="center">
          {message}
        </Text>
      ) : null}
      <Button label="Retry" onPress={onRetry} />
    </View>
  );
}
