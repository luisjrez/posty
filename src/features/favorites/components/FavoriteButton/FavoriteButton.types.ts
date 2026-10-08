export type FavoriteButtonPlacement = 'card' | 'header';

export type FavoriteButtonProps = {
  isFavorite: boolean;
  onPress: () => void;
  testID: string;
  /** In a header the native bar already insets its items, so the button adds no padding. */
  placement?: FavoriteButtonPlacement;
};
