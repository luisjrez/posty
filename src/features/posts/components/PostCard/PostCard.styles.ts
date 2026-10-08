import { StyleSheet } from 'react-native-unistyles';

// Room the title leaves on its right for a floating accessory (a 36pt button plus its inset).
const ACCESSORY_ROOM = 36;

export const styles = StyleSheet.create((theme) => ({
  container: {
    marginHorizontal: theme.space.lg,
  },
  card: {
    gap: theme.space.xs,
    padding: theme.space.lg,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.subtle,
    backgroundColor: theme.colors.bg.surface,
  },
  pressed: {
    backgroundColor: theme.colors.bg.muted,
  },
  titleBesideAccessory: {
    marginRight: ACCESSORY_ROOM,
  },
  accessory: {
    position: 'absolute',
    top: theme.space.sm,
    right: theme.space.sm,
  },
}));
