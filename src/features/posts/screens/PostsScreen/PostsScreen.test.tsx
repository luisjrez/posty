import { render, screen } from '@testing-library/react-native';

import { PostsScreen } from './PostsScreen';

describe('PostsScreen', () => {
  it('renders the app name', async () => {
    await render(<PostsScreen />);

    expect(screen.getByText('Posty')).toBeOnTheScreen();
  });
});
