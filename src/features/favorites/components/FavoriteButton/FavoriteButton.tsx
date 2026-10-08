import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, type PressableStateCallbackType } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { ICON_SIZE, styles } from './FavoriteButton.styles';
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
// Each placement keeps the touch target at 44pt: (44 - 36) / 2 on cards, (44 - 22) / 2 in headers.
const HIT_SLOP = { card: 4, header: 11 };

function cardStyle({ pressed }: PressableStateCallbackType) {
  return [styles.card, pressed && styles.cardPressed];
}

function headerStyle({ pressed }: PressableStateCallbackType) {
  return [styles.header, pressed && styles.headerPressed];
}

export function FavoriteButton({
  isFavorite,
  onPress,
  testID,
  placement = 'card',
}: FavoriteButtonProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Favorite"
      // "Selected" is how screen readers announce a saved Post.
      accessibilityState={{ selected: isFavorite }}
      hitSlop={HIT_SLOP[placement]}
      onPress={onPress}
      style={placement === 'header' ? headerStyle : cardStyle}
    >
      <SymbolView
        name={isFavorite ? HEART_FILLED : HEART}
        size={ICON_SIZE}
        tintColor={isFavorite ? theme.colors.text.accent : theme.colors.text.secondary}
      />
    </Pressable>
  );
}
