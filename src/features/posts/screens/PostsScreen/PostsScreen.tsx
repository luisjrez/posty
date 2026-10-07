import { FlatList, type ListRenderItem } from 'react-native';

import { Box, Text } from '@/shared/components';

import { usePostsList } from '../../hooks/usePostsList';
import type { Post } from '../../model';

import type { PostsScreenProps } from './PostsScreen.types';
import { styles } from './PostsScreen.styles';

const keyExtractor = (post: Post) => String(post.id);

const renderPost: ListRenderItem<Post> = ({ item }) => (
  <Text variant="body" style={styles.title}>
    {item.title}
  </Text>
);

export function PostsScreen(_props: PostsScreenProps) {
  const { data, isPending, isError } = usePostsList();

  if (isPending || isError) {
    return (
      <Box style={styles.centered}>
        <Text color="muted">{isPending ? 'Loading posts…' : 'Could not load posts'}</Text>
      </Box>
    );
  }

  return (
    <FlatList
      data={data.posts}
      keyExtractor={keyExtractor}
      renderItem={renderPost}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.list}
    />
  );
}
