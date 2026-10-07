import { Box, Text } from '@/shared/components';

import type { PostsScreenProps } from './PostsScreen.types';
import { styles } from './PostsScreen.styles';

export function PostsScreen(_props: PostsScreenProps) {
  return (
    <Box style={styles.container}>
      <Text variant="display">Posty</Text>
      <Text variant="bodySm" color="muted">
        Design system ready
      </Text>
    </Box>
  );
}
