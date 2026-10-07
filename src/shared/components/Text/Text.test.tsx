import { render, screen } from '@testing-library/react-native';

import { light } from '@/design-system/generated/themes';
import { textStyleProps } from '@/design-system/generated/styleProps';

import { Text } from './Text';

describe('Text', () => {
  it('renders its children and forwards RN props', async () => {
    await render(
      <Text variant="title" weight="bold" accessibilityRole="header">
        Hello
      </Text>,
    );

    expect(screen.getByRole('header', { name: 'Hello' })).toBeOnTheScreen();
  });

  it('maps token props to styles, with overrides on top of the variant', () => {
    const props = textStyleProps(light);

    expect(props.variant.bodySm).toEqual({
      fontFamily: light.fontFamily.regular,
      fontSize: light.fontSize.sm,
      lineHeight: light.lineHeight.sm,
    });
    expect(props.weight.bold).toEqual({ fontFamily: light.fontFamily.bold });
    expect(props.fontSize.xs).toEqual({ fontSize: light.fontSize.xs });
  });
});
