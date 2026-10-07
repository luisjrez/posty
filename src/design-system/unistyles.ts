import { StyleSheet } from 'react-native-unistyles';

import { themes } from './generated/themes';

type AppThemes = typeof themes;

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- module augmentation requires an interface
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes,
  settings: { adaptiveThemes: true },
});
