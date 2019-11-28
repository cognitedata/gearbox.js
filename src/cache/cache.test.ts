import { Asset } from '@cognite/sdk';
import { singleTimeseries } from '../mocks';
import { MockCogniteClient } from '../mocks/mockSdk';
import { CacheAssets } from './resources/CacheAssets';
import { CacheTimeseries } from './resources/CacheTimeseries';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    retrieve: jest.fn(),
  };
  timeseries: any = {
    retrieve: jest.fn(),
  };
}
let cacheAssets: CacheAssets;
let cacheTimeseries: CacheTimeseries;
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
  cacheTimeseries = new CacheTimeseries(client);
  client.assets.retrieve.mockReturnValue(Promise.resolve([asset]));
  client.timeseries.retrieve.mockReturnValue(
    Promise.resolve([singleTimeseries])
  );
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

  it('should return promise pointer from assets requests', () => {
    cacheAssets.retrieve([{ id: 0 }]);
    cacheAssets.retrieve([{ id: 0 }]);

    expect(client.assets.retrieve).toHaveBeenCalledTimes(1);
  });
  it('should return promise pointer from timeseries requests', () => {
    cacheTimeseries.retrieve([{ id: 0 }]);
    cacheTimeseries.retrieve([{ id: 0 }]);

    expect(client.timeseries.retrieve).toHaveBeenCalledTimes(1);
  });
  it('should return response from cached assets responses', async () => {
    const asset1 = await cacheAssets.retrieve([{ id: 0 }]);

    await cacheAssets.retrieve([{ id: 0 }]);

    expect(client.assets.retrieve).toHaveBeenCalledTimes(1);
    expect(asset1[0]).toMatchObject(asset);
  });
  it('should return response from cached timeseries responses', async () => {
    const timeserie1 = await cacheTimeseries.retrieve([{ id: 0 }]);

    await cacheTimeseries.retrieve([{ id: 0 }]);

    expect(client.timeseries.retrieve).toHaveBeenCalledTimes(1);
    expect(timeserie1[0]).toMatchObject(singleTimeseries);
  });
});
