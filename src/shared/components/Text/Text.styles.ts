import { StyleSheet } from 'react-native-unistyles';

import { textStyleProps } from '@/design-system/generated/styleProps';

export const styles = StyleSheet.create((theme) => ({
  text: {
    color: theme.colors.text.primary,
    variants: {
      ...textStyleProps(theme),
      align: {
        left: { textAlign: 'left' },
        center: { textAlign: 'center' },
        right: { textAlign: 'right' },
      },
    },
  },
}));
