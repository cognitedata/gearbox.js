import { CogniteClient } from '@cognite/sdk';
import {
  ClientSDKCacheAssets,
  ClientSDKCacheContextType,
} from '../../../context/clientSDKCacheContext';
import { CacheAssets } from './cache/CacheAssets';

export class ClientSDKCache implements ClientSDKCacheContextType {
  assets: ClientSDKCacheAssets;

  constructor(client: CogniteClient) {
    this.assets = new CacheAssets(client);
  }
}
