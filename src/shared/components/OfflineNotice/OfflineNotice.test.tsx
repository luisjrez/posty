import { render, screen } from '@testing-library/react-native';

import { OfflineNotice } from './OfflineNotice';

describe('OfflineNotice', () => {
  it('says the content is offline and how old it is', async () => {
    jest.useFakeTimers({ now: new Date('2026-10-08T12:00:00Z') });
    await render(<OfflineNotice updatedAt={new Date('2026-10-08T11:55:00Z').getTime()} />);

    expect(screen.getByText('Offline · updated 5 min ago')).toBeOnTheScreen();
    jest.useRealTimers();
  });
});
