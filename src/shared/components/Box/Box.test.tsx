import { render, screen } from '@testing-library/react-native';

import { light } from '@/design-system/generated/themes';
import { boxStyleProps } from '@/design-system/generated/styleProps';

import { Box } from './Box';

describe('Box', () => {
  it('renders children and forwards RN props', async () => {
    await render(<Box testID="box" padding="md" bg="surface" />);

    expect(screen.getByTestId('box')).toBeOnTheScreen();
  });

  it('maps spacing, color and radius tokens to styles', () => {
    const props = boxStyleProps(light);

    expect(props.padding.md).toEqual({ padding: light.space.md });
    expect(props.paddingX.lg).toEqual({ paddingHorizontal: light.space.lg });
    expect(props.bg.surface).toEqual({ backgroundColor: light.colors.bg.surface });
    expect(props.radius.full).toEqual({ borderRadius: light.radius.full });
  });
});
