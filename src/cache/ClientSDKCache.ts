import { CogniteClient } from '@cognite/sdk';
import {
  ClientSDKCacheAssets,
  ClientSDKCacheContextType,
  ClientSDKCacheTimeseries,
} from '../context/clientSDKCacheContext';
import { CacheAssets } from './resources/CacheAssets';
import { CacheTimeseries } from './resources/CacheTimeseries';

export class ClientSDKCache implements ClientSDKCacheContextType {
  assets: ClientSDKCacheAssets;
  timeseries: ClientSDKCacheTimeseries;

  private client: CogniteClient;

  constructor(client: CogniteClient) {
    this.client = client;
    this.assets = new CacheAssets(this.provideClient);
    this.timeseries = new CacheTimeseries(this.provideClient);
  }

  swapClient = (client: CogniteClient) => {
    this.client = client;
  };

  private provideClient = (): CogniteClient => {
    return this.client;
  };
}
