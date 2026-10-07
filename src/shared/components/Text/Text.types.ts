import type { TextProps as RNTextProps } from 'react-native';
import type { UnistylesVariants } from 'react-native-unistyles';

import type { styles } from './Text.styles';

export type TextProps = RNTextProps & UnistylesVariants<typeof styles>;
