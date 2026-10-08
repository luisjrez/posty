import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, type PressableStateCallbackType } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './FavoriteButton.styles';
import type { FavoriteButtonProps } from './FavoriteButton.types';

const HEART = {
  ios: 'heart',
  android: 'favorite_border',
  web: 'favorite_border',
} satisfies SymbolViewProps['name'];
const HEART_FILLED = {
  ios: 'heart.fill',
  android: 'favorite',
  web: 'favorite',
} satisfies SymbolViewProps['name'];
const HIT_SLOP = 4; // (44 - 36) / 2
const ICON_SIZE = 22;

function buttonStyle({ pressed }: PressableStateCallbackType) {
  return [styles.button, pressed && styles.pressed];
}

export function FavoriteButton({ isFavorite, onPress, testID }: FavoriteButtonProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Favorite"
      // "Selected" is how screen readers announce a saved Post.
      accessibilityState={{ selected: isFavorite }}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      style={buttonStyle}
    >
      <SymbolView
        name={isFavorite ? HEART_FILLED : HEART}
        size={ICON_SIZE}
        tintColor={isFavorite ? theme.colors.text.accent : theme.colors.text.secondary}
      />
    </Pressable>
  );
}
