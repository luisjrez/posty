import 'react-native-unistyles/mocks';

import '@/design-system/unistyles';

import { server } from './msw/server';

// The root layout wires TanStack's online manager to NetInfo, which has no native module in Jest.
jest.mock('@react-native-community/netinfo', () =>
  jest.requireActual('@react-native-community/netinfo/jest/netinfo-mock.js'),
);

jest.mock('../config/env', () => ({
  env: { variant: 'development', apiUrl: 'https://jsonplaceholder.typicode.com' },
}));

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  server.events.removeAllListeners();
});
afterAll(() => server.close());
