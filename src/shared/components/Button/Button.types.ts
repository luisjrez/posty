import type { PressableProps } from 'react-native';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
};
