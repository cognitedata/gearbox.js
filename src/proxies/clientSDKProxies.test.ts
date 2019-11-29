import { IdEither } from '@cognite/sdk';
import { MockCogniteClient } from '../mocks/mockSdk';
import { wrapInProxies } from './clientSDKProxies';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    retrieve: jest
      .fn()
      .mockImplementation(async (ids: IdEither[]) => Promise.resolve(ids)),
    list: jest.fn(),
  };
  datapoints: any = {
    retrieve: jest.fn(),
  };
  loginWithOAuth: any = jest.fn();
  setOneTimeSdkHeader: any = jest.fn();
}

describe('proxied cognite client', () => {
  let client: CogniteClient;
  let proxiedClient: CogniteClient;

  beforeAll(() => {
    client = new CogniteClient({ appId: 'test' });
    proxiedClient = wrapInProxies(client)('test')!;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should not cache calls', async () => {
    await proxiedClient.assets.retrieve([{ id: 1 }]);
    await proxiedClient.assets.retrieve([{ id: 1 }]);

    expect(client.assets.retrieve).toHaveBeenCalledTimes(2);
    expect(client.setOneTimeSdkHeader).toHaveBeenCalledTimes(2);
  });
  it('should not track excluded function', () => {
    proxiedClient.loginWithOAuth();

    expect(client.loginWithOAuth).toHaveBeenCalledTimes(1);
    expect(client.setOneTimeSdkHeader).toHaveBeenCalledTimes(0);
  });
  it('should cache supported calls', async () => {
    proxiedClient = wrapInProxies(client)('test', true)!;

    await proxiedClient.assets.retrieve([{ id: 1 }]);
    await proxiedClient.datapoints.retrieve();
    await proxiedClient.assets.list();
    await proxiedClient.assets.retrieve([{ id: 1 }]);
    await proxiedClient.loginWithOAuth();

    expect(client.assets.retrieve).toHaveBeenCalledTimes(1);
    expect(client.assets.list).toHaveBeenCalledTimes(1);
    expect(client.loginWithOAuth).toHaveBeenCalledTimes(1);
    expect(client.setOneTimeSdkHeader).toHaveBeenCalledTimes(3);
  });
});
