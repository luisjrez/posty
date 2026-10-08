import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  card: {
    gap: theme.space.sm,
    marginHorizontal: theme.space.lg,
    padding: theme.space.lg,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.subtle,
    backgroundColor: theme.colors.bg.surface,
  },
  line: {
    height: theme.space.md,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.bg.muted,
  },
  title: {
    width: '80%',
    height: theme.space.lg,
  },
  short: {
    width: '55%',
  },
}));
