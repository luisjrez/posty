import { fireEvent, render, screen } from '@testing-library/react-native';

import { buildPost } from '@/test';

import { PostCard } from './PostCard';

describe('PostCard', () => {
  it('shows the title and body and reports the pressed Post', async () => {
    const post = buildPost({ title: 'A title', body: 'A body' });
    const onPress = jest.fn();
    await render(<PostCard post={post} onPress={onPress} />);

    expect(screen.getByText('A body')).toBeOnTheScreen();
    expect(screen.getByTestId(`post-${post.id}`)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'A title' }));

    expect(onPress).toHaveBeenCalledWith(post);
  });
});
