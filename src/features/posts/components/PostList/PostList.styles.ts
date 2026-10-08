import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  content: {
    paddingVertical: theme.space.md,
  },
  header: {
    paddingBottom: theme.space.md,
  },
  separator: {
    height: theme.space.md,
  },
}));
