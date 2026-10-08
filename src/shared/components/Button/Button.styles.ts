import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: theme.space.xl,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accent.default,
  },
  pressed: {
    opacity: 0.8,
  },
}));
