import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.canvas,
  },
  content: {
    flexGrow: 1,
    gap: theme.space.xl,
    padding: theme.space.lg,
  },
  post: {
    gap: theme.space.md,
  },
  skeleton: {
    gap: theme.space.sm,
  },
  line: {
    height: theme.space.md,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.bg.muted,
  },
  titleLine: {
    width: '80%',
    height: theme.space.xl,
    marginBottom: theme.space.sm,
  },
  short: {
    width: '55%',
  },
}));
