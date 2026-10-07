import { parseEnv } from './parseEnv';

describe('parseEnv', () => {
  it('returns the typed env and strips unknown keys', () => {
    const env = parseEnv({
      variant: 'staging',
      apiUrl: 'https://jsonplaceholder.typicode.com',
      eas: { projectId: 'abc' },
    });

    expect(env).toEqual({
      variant: 'staging',
      apiUrl: 'https://jsonplaceholder.typicode.com',
    });
  });

  it('throws a readable error when a value is missing or invalid', () => {
    expect(() => parseEnv({ variant: 'qa' })).toThrow(/Invalid app config extra/);
  });

  it('throws when extra is absent', () => {
    expect(() => parseEnv(undefined)).toThrow(/Invalid app config extra/);
  });
});
