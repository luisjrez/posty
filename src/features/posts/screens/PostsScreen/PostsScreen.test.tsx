import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react-native';

import { API_URL, renderWithProviders, server } from '@/test';

import { PostsScreen } from './PostsScreen';

describe('PostsScreen', () => {
  it('renders the titles of the first page', async () => {
    await renderWithProviders(<PostsScreen />);

    expect(await screen.findByText('Post 1')).toBeOnTheScreen();
    expect(screen.getByText('Post 2')).toBeOnTheScreen();
  });

  it('shows an error when the request fails', async () => {
    server.use(http.get(`${API_URL}/posts`, () => new HttpResponse(null, { status: 500 })));

    await renderWithProviders(<PostsScreen />);

    expect(await screen.findByText('Could not load posts')).toBeOnTheScreen();
  });
});
