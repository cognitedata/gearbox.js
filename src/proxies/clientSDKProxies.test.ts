import { version } from '../../package.json';
import { MockCogniteClient } from '../mocks/mockSdk';
import { wrapInProxies } from './clientSDKProxies';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    retrieve: async (ids: number[]) => ids,
  };
}

describe('proxied cognite client', () => {
  let client: CogniteClient;
  let retrieve: typeof client.assets.retrieve;

  beforeAll(() => {
    client = wrapInProxies(new CogniteClient({ appId: 'test' }))('test')!;
    retrieve = client.assets.retrieve;
  });

  beforeEach(() => {
    client.setOneTimeSdkHeader = jest.fn();
  });

  test('calls', async () => {
    expect(await retrieve([1])).toEqual([1]);
  });

  test("don't mess up with non-api members", () => {
    expect(() => client.project).not.toThrowError();
  });

  test("don't set sdk header on accessor", () => {
    client.assets.retrieve; // tslint:disable-line
    expect(client.setOneTimeSdkHeader).toBeCalledTimes(0);
  });

  test('set sdk header twice', async () => {
    await retrieve();
    await retrieve();
    expect(client.setOneTimeSdkHeader).toBeCalledTimes(2);
  });

  test('set correct sdk header', () => {
    retrieve();
    const header = `CogniteGearbox:${version}/test`;
    expect(client.setOneTimeSdkHeader).toHaveBeenLastCalledWith(header);
  });
});
