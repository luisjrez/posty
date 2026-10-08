import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space.md,
    padding: theme.space.xl,
  },
}));
