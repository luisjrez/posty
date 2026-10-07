import { AxiosError, AxiosHeaders } from 'axios';

import { ApiError, toApiError } from './ApiError';

function axiosResponseError(status: number): AxiosError {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, null, {
    status,
    statusText: '',
    headers: {},
    config,
    data: null,
  });
}

describe('toApiError', () => {
  it('maps a response with an error status to http', () => {
    expect(toApiError(axiosResponseError(404))).toMatchObject({ kind: 'http', status: 404 });
  });

  it('maps an Axios timeout to timeout', () => {
    expect(toApiError(new AxiosError('timeout', AxiosError.ECONNABORTED))).toMatchObject({
      kind: 'timeout',
    });
  });

  it('maps a request without a response to network', () => {
    expect(toApiError(new AxiosError('Network Error', AxiosError.ERR_NETWORK))).toMatchObject({
      kind: 'network',
    });
  });

  it('keeps an existing ApiError as is', () => {
    const error = new ApiError('parse', 'bad shape');

    expect(toApiError(error)).toBe(error);
  });
});
