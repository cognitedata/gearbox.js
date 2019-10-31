import { Asset } from '@cognite/sdk';
import { MockCogniteClient } from '../../../../utils/mockSdk';
import { CacheAssets } from './CacheAssets';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    retrieve: jest.fn(),
  };
}
let cacheAssets: CacheAssets;
const client = new CogniteClient({ appId: 'cache-test' });

const asset: Asset = {
  id: 0,
  name: 'Test asset',
  rootId: 1,
  lastUpdatedTime: new Date(),
  createdTime: new Date(),
};
beforeEach(() => {
  cacheAssets = new CacheAssets(client);
  client.assets.retrieve.mockReturnValue(Promise.resolve([asset]));
});
afterEach(() => {
  jest.clearAllMocks();
});

describe('CacheAssets', () => {
  it('should call client sdk method', () => {
    cacheAssets.retrieve([{ id: 0 }]);

    expect(client.assets.retrieve).toHaveBeenCalledTimes(1);

    cacheAssets.retrieve([{ id: 1 }]);

    expect(client.assets.retrieve).toHaveBeenCalledTimes(2);
  });

  it('should return promise pointer from requests', () => {
    cacheAssets.retrieve([{ id: 0 }]);
    cacheAssets.retrieve([{ id: 0 }]);

    expect(client.assets.retrieve).toHaveBeenCalledTimes(1);
  });

  it('should return response from cached responses', async () => {
    const asset1 = await cacheAssets.retrieve([{ id: 0 }]);

    await cacheAssets.retrieve([{ id: 0 }]);

    expect(client.assets.retrieve).toHaveBeenCalledTimes(1);
    expect(asset1[0]).toMatchObject(asset);
  });
});
