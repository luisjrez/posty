import { View } from 'react-native';

import { styles } from './Box.styles';
import type { BoxProps } from './Box.types';

export function Box({
  bg,
  radius,
  padding,
  paddingX,
  paddingY,
  margin,
  marginX,
  marginY,
  gap,
  direction,
  align,
  justify,
  flex,
  style,
  ...rest
}: BoxProps) {
  styles.useVariants({
    bg,
    radius,
    padding,
    paddingX,
    paddingY,
    margin,
    marginX,
    marginY,
    gap,
    direction,
    align,
    justify,
    flex,
  });
  return <View {...rest} style={[styles.box, style]} />;
}
