import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    gap: theme.space.md,
    paddingVertical: theme.space.md,
    backgroundColor: theme.colors.bg.canvas,
  },
}));
