import type { FavoriteButtonPlacement } from '../../components/FavoriteButton';
import type { SnapshotInput } from '../../store/favorites.store';

export type FavoriteToggleProps = SnapshotInput & { placement?: FavoriteButtonPlacement };
