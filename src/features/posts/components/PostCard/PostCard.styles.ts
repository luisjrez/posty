import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  card: {
    gap: theme.space.xs,
    marginHorizontal: theme.space.lg,
    padding: theme.space.lg,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.subtle,
    backgroundColor: theme.colors.bg.surface,
  },
  pressed: {
    backgroundColor: theme.colors.bg.muted,
  },
}));
