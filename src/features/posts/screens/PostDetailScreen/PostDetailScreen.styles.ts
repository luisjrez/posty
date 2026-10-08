import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.canvas,
  },
  content: {
    padding: theme.space.lg,
  },
}));
