import { IdEither } from '@cognite/sdk';
import { ClientSDKCache } from '../cache/ClientSDKCache';
import { MockCogniteClient } from '../mocks/mockSdk';
import { wrapInCacheProxy } from './clientSDKCacheProxy';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    retrieve: jest
      .fn()
      .mockImplementation(async (ids: IdEither[]) => Promise.resolve(ids)),
  };
  datapoints: any = {
    retrieve: jest.fn(),
  };
}

describe('cache proxy for cognite client', () => {
  let client: CogniteClient;
  let cachedClient: CogniteClient;

  beforeAll(() => {
    client = new CogniteClient({ appId: 'test' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    const cache = new ClientSDKCache(client);
    cachedClient = wrapInCacheProxy(client, cache);
  });

  it('should cache called request', async () => {
    await cachedClient.assets.retrieve([{ id: 1 }]);
    await cachedClient.assets.retrieve([{ id: 1 }]);
    expect(client.assets.retrieve).toHaveBeenCalledTimes(1);
  });

  it('should not cache called request with different props', async () => {
    await cachedClient.assets.retrieve([{ id: 1 }]);
    await cachedClient.assets.retrieve([{ id: 2 }]);
    await cachedClient.assets.retrieve([{ id: 2 }]);

    expect(client.assets.retrieve).toHaveBeenCalledTimes(2);
  });

  it('should skip caching of non-defined as cached functions', () => {
    cachedClient.datapoints.retrieve();
    cachedClient.datapoints.retrieve();

    expect(client.datapoints.retrieve).toHaveBeenCalledTimes(2);
  });
});
