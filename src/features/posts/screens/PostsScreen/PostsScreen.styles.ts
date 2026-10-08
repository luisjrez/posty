import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  list: {
    flex: 1,
    backgroundColor: theme.colors.bg.canvas,
  },
  content: {
    flexGrow: 1,
    gap: theme.space.md,
    paddingVertical: theme.space.md,
  },
  skeleton: {
    gap: theme.space.md,
  },
  message: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space.md,
    padding: theme.space.xl,
  },
  footer: {
    alignItems: 'center',
    gap: theme.space.sm,
    paddingVertical: theme.space.lg,
  },
}));
