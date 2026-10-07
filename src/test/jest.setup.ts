import 'react-native-unistyles/mocks';

import '@/design-system/unistyles';

import { server } from './msw/server';

jest.mock('../config/env', () => ({
  env: { variant: 'development', apiUrl: 'https://jsonplaceholder.typicode.com' },
}));

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  server.events.removeAllListeners();
});
afterAll(() => server.close());
