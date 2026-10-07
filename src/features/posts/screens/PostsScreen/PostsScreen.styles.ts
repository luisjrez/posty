import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.canvas,
  },
  list: {
    flex: 1,
    backgroundColor: theme.colors.bg.canvas,
  },
  title: {
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.sm,
  },
}));
