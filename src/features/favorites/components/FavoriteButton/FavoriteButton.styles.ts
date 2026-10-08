import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  button: {
    // 44pt is the minimum touch target on iOS (48dp on Android is met by the hit slop).
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
  },
  pressed: {
    backgroundColor: theme.colors.bg.muted,
  },
}));
