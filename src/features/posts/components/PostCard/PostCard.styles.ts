import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  card: {
    flexDirection: 'row',
    marginHorizontal: theme.space.lg,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.subtle,
    backgroundColor: theme.colors.bg.surface,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    gap: theme.space.xs,
    padding: theme.space.lg,
  },
  pressed: {
    backgroundColor: theme.colors.bg.muted,
  },
  accessory: {
    paddingTop: theme.space.sm,
    paddingRight: theme.space.sm,
  },
}));
