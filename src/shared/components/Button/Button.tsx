import { Pressable, type PressableStateCallbackType } from 'react-native';

import { Text } from '../Text';

import { styles } from './Button.styles';
import type { ButtonProps } from './Button.types';

function pressableStyle({ pressed }: PressableStateCallbackType) {
  return [styles.button, pressed && styles.pressed];
}

export function Button({ label, ...rest }: ButtonProps) {
  return (
    <Pressable accessibilityRole="button" {...rest} style={pressableStyle}>
      <Text variant="label" color="onAccent">
        {label}
      </Text>
    </Pressable>
  );
}
