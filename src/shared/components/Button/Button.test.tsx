import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from './Button';

describe('Button', () => {
  it('is announced as a button named by its label and reports presses', async () => {
    const onPress = jest.fn();
    await render(<Button label="Retry" onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
