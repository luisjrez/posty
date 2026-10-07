import { StyleSheet } from 'react-native-unistyles';

import { boxStyleProps } from '@/design-system/generated/styleProps';

export const styles = StyleSheet.create((theme) => ({
  box: {
    variants: {
      ...boxStyleProps(theme),
      direction: { row: { flexDirection: 'row' }, column: { flexDirection: 'column' } },
      align: {
        start: { alignItems: 'flex-start' },
        center: { alignItems: 'center' },
        end: { alignItems: 'flex-end' },
        stretch: { alignItems: 'stretch' },
      },
      justify: {
        start: { justifyContent: 'flex-start' },
        center: { justifyContent: 'center' },
        end: { justifyContent: 'flex-end' },
        between: { justifyContent: 'space-between' },
      },
      flex: { true: { flex: 1 }, false: {} },
    },
  },
}));
