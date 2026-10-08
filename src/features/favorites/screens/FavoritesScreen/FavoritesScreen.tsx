import { FavoritesListController } from '../../controllers/FavoritesListController';

import type { FavoritesScreenProps } from './FavoritesScreen.types';

// The screen only places the controller; state, data and navigation live there.
export function FavoritesScreen(_props: FavoritesScreenProps) {
  return <FavoritesListController />;
}
