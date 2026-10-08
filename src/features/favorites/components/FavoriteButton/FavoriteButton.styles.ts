import { StyleSheet } from 'react-native-unistyles';

// On cards, a 36pt circle around the 22pt icon; its hit slop brings the target to 44pt.
const CARD_SIZE = 36;
export const ICON_SIZE = 22;

export const styles = StyleSheet.create((theme) => ({
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CARD_SIZE / 2,
  },
  cardPressed: {
    backgroundColor: theme.colors.bg.muted,
  },
  // Flush with the icon, like native bar buttons, which also dim instead of showing a background.
  header: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  headerPressed: {
    opacity: 0.4,
  },
}));
