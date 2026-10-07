import type { ViewProps } from 'react-native';
import type { UnistylesVariants } from 'react-native-unistyles';

import type { styles } from './Box.styles';

export type BoxProps = ViewProps & UnistylesVariants<typeof styles>;
