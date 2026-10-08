import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.space.md,
  },
  skeleton: {
    gap: theme.space.sm,
    padding: theme.space.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.surface,
  },
  line: {
    height: theme.space.md,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.bg.muted,
  },
  short: {
    width: '55%',
  },
  error: {
    alignItems: 'flex-start',
    gap: theme.space.sm,
  },
}));
