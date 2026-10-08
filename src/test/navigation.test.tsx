import { act, fireEvent, screen } from '@testing-library/react-native';
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

  it('opens the detail from the Posts tab', async () => {
    await renderRouter(APP_ROOT, { initialUrl: '/' });

    await act(() => router.push('/posts/3'));

    expect(await screen.findByText('Comment 1 on post 3')).toBeOnTheScreen();
  });

  it('opens the detail from the Favorites tab', async () => {
    await renderRouter(APP_ROOT, { initialUrl: '/favorites' });

    await act(() => router.push('/posts/7'));

    expect(await screen.findByText('Comment 1 on post 7')).toBeOnTheScreen();
  });
});

describe('deep links', () => {
  it('opens a Post on cold start with the tabs underneath, so back returns to the list', async () => {
    await renderRouter(APP_ROOT, { initialUrl: '/posts/5' });
    expect(await screen.findByText('Comment 1 on post 5')).toBeOnTheScreen();

    await act(() => router.back());

    expect(await screen.findByText('Post 1')).toBeOnTheScreen();
  });

  it('opens a link while the app is already running', async () => {
    await renderRouter(APP_ROOT, { initialUrl: '/favorites' });

    await act(() => router.navigate('/posts/6'));

    expect(await screen.findByText('Comment 1 on post 6')).toBeOnTheScreen();
  });

  it('leaves "Post not found" through its button on cold start, landing on the tabs', async () => {
    await renderRouter(APP_ROOT, { initialUrl: '/posts/abc' });
    expect(await screen.findByText('Post not found')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Go back' }));

    expect(await screen.findByText('Post 1')).toBeOnTheScreen();
    expect(screen.queryByText('Post not found')).not.toBeOnTheScreen();
  });

  it('goes back to where the reader was when "Post not found" was pushed on top', async () => {
    await renderRouter(APP_ROOT, { initialUrl: '/favorites' });
    await act(() => router.push('/posts/999'));
    expect(await screen.findByText('Post not found')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Go back' }));

    expect(await screen.findByText('No favorites yet')).toBeOnTheScreen();
  });
});
