import { View } from 'react-native';

import { formatTimeAgo } from '@/shared/lib';

import { Text } from '../Text';

import { styles } from './OfflineNotice.styles';
import type { OfflineNoticeProps } from './OfflineNotice.types';

// Discreet on purpose: offline content is still useful, the notice only flags that it may be stale.
export function OfflineNotice({ updatedAt }: OfflineNoticeProps) {
  return (
    <View style={styles.container} accessibilityRole="text">
      <Text variant="caption" color="secondary">
        Offline · updated {formatTimeAgo(updatedAt)}
      </Text>
    </View>
  );
}
