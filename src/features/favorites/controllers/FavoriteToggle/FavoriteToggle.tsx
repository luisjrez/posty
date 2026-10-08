import { useCallback } from 'react';

import { FavoriteButton } from '../../components/FavoriteButton';
import { useIsFavorite } from '../../hooks/useIsFavorite';
import { useToggleFavorite } from '../../hooks/useToggleFavorite';

import type { FavoriteToggleProps } from './FavoriteToggle.types';

// Each heart subscribes to its own Post's entry, so toggling one re-renders only that heart.
export function FavoriteToggle({ post, comments }: FavoriteToggleProps) {
  const isFavorite = useIsFavorite(post.id);
  const toggle = useToggleFavorite();
  const handlePress = useCallback(() => toggle({ post, comments }), [toggle, post, comments]);

  return (
    <FavoriteButton
      isFavorite={isFavorite}
      onPress={handlePress}
      testID={`favorite-toggle-${post.id}`}
    />
  );
}
