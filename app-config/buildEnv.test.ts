import { parseBuildEnv } from './buildEnv';

describe('parseBuildEnv', () => {
  it('returns the typed build env', () => {
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

  it('fails loudly on a missing or unknown variant', () => {
    expect(() => parseBuildEnv({ API_URL: 'https://x.dev' })).toThrow(/Invalid build env/);
    expect(() => parseBuildEnv({ APP_VARIANT: 'qa', API_URL: 'https://x.dev' })).toThrow(
      /Invalid build env/,
    );
  });
});
