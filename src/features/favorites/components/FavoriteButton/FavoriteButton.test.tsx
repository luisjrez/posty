import { fireEvent, render, screen } from '@testing-library/react-native';

import { FavoriteButton } from './FavoriteButton';

describe('FavoriteButton', () => {
  it('announces the saved state and reports presses', async () => {
    const onPress = jest.fn();
    await render(<FavoriteButton isFavorite testID="heart" onPress={onPress} />);

    const button = screen.getByRole('button', { name: 'Favorite' });
    expect(button).toBeSelected();

    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is not selected when the Post is not saved', async () => {
    await render(<FavoriteButton isFavorite={false} testID="heart" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Favorite' })).not.toBeSelected();
  });
});
