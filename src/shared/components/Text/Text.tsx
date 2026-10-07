import { Text as RNText } from 'react-native';

import { styles } from './Text.styles';
import type { TextProps } from './Text.types';

export function Text({
  variant = 'body',
  color,
  fontSize,
  lineHeight,
  weight,
  align,
  style,
  ...rest
}: TextProps) {
  styles.useVariants({ variant, color, fontSize, lineHeight, weight, align });
  return <RNText {...rest} style={[styles.text, style]} />;
}
