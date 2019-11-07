import { CogniteClient } from '@cognite/sdk';
import {
  ClientSDKCacheAssets,
  ClientSDKCacheContextType,
  ClientSDKCacheTimeseries,
} from '../../../context/clientSDKCacheContext';
import { CacheAssets } from './cache/CacheAssets';
import { CacheTimeseries } from './cache/CacheTimeseries';

export class ClientSDKCache implements ClientSDKCacheContextType {
  assets: ClientSDKCacheAssets;
  timeseries: ClientSDKCacheTimeseries;

  constructor(client: CogniteClient) {
    this.assets = new CacheAssets(client);
    this.timeseries = new CacheTimeseries(client);
  }
}
