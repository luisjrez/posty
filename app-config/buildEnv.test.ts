import { parseBuildEnv } from './buildEnv';

describe('parseBuildEnv', () => {
  it('should return the typed build env', () => {
    expect(
      parseBuildEnv({
        APP_VARIANT: 'staging',
        API_URL: 'https://jsonplaceholder.typicode.com',
      }),
    ).toEqual({
      APP_VARIANT: 'staging',
      API_URL: 'https://jsonplaceholder.typicode.com',
    });
  });

  it('should default to the development variant', () => {
    expect(parseBuildEnv({ API_URL: 'https://x.dev' }).APP_VARIANT).toBe('development');
  });

  it('should allow a missing API_URL outside EAS builds', () => {
    expect(parseBuildEnv({ APP_VARIANT: 'staging' })).toEqual({ APP_VARIANT: 'staging' });
  });

  it('should require API_URL inside EAS builds', () => {
    expect(() => parseBuildEnv({ APP_VARIANT: 'staging', EAS_BUILD: 'true' })).toThrow(
      /Invalid build env/,
    );
  });

  it('should fail loudly on an unknown variant or a malformed API_URL', () => {
    expect(() => parseBuildEnv({ APP_VARIANT: 'qa', API_URL: 'https://x.dev' })).toThrow(
      /Invalid build env/,
    );
    expect(() => parseBuildEnv({ APP_VARIANT: 'staging', API_URL: 'not-a-url' })).toThrow(
      /Invalid build env/,
    );
  });
});
