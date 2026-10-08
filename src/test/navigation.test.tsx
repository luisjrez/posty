import { act, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';
import path from 'node:path';

const APP_ROOT = path.resolve(__dirname, '../app');

describe('tabs shell', () => {
  it('opens on the Posts tab', async () => {
    await renderRouter(APP_ROOT, { initialUrl: '/' });

    expect(await screen.findByText('Post 1')).toBeOnTheScreen();
  });

  it('switches to the Favorites tab', async () => {
    await renderRouter(APP_ROOT, { initialUrl: '/' });

    await act(() => router.navigate('/favorites'));

    expect(await screen.findByText('No favorites yet')).toBeOnTheScreen();
  });

  it('reaches the shared detail route from the Posts stack', async () => {
    await renderRouter(APP_ROOT, { initialUrl: '/' });

    await act(() => router.push('/posts/3'));

    expect(await screen.findByText('Post 3')).toBeOnTheScreen();
  });

  it('reaches the shared detail route from the Favorites stack', async () => {
    await renderRouter(APP_ROOT, { initialUrl: '/favorites' });

    await act(() => router.push('/posts/7'));

    expect(await screen.findByText('Post 7')).toBeOnTheScreen();
  });
});
