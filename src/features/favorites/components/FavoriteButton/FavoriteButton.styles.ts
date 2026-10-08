import { StyleSheet } from 'react-native-unistyles';

// A 36pt circle keeps the pressed highlight inside a 44pt header bar; the hit slop brings the
// touch target back up to the 44pt minimum.
const SIZE = 36;

export const styles = StyleSheet.create((theme) => ({
  button: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZE / 2,
  },
  pressed: {
    backgroundColor: theme.colors.bg.muted,
  },
}));
