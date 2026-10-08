export type EmptyStateProps = {
  title: string;
  message?: string;
  /** A way out of the empty state, shown under the message. */
  action?: { label: string; onPress: () => void };
};
