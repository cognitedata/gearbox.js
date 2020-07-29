// Copyright 2020 Cognite AS
import {
  AssetList,
  CogniteClient,
  ExternalId,
  IdEither,
  InternalId,
} from '@cognite/sdk';
import { ClientSDKCacheAssets } from '../../context/clientSDKCacheContext';
import { CacheBase } from './CacheBase';

export class CacheAssets extends CacheBase implements ClientSDKCacheAssets {
  private client: () => CogniteClient;

  constructor(client: () => CogniteClient) {
    super();
    this.client = client;
  }

  retrieve = async (ids: IdEither[]): Promise<AssetList> => {
    const apiCall = 'retrieve';
    this.handleFirstCallToCache(apiCall);

    const key = ids
      .map(idObj => {
        return (idObj as InternalId).id || (idObj as ExternalId).externalId;
      })
      .sort()
      .join(',');
    const cached = this.checkCachedValue(apiCall, key);

    if (cached) {
      return cached.value;
    }
    const request = this.client().assets.retrieve(ids);
    this.cacheRequest(apiCall, key, request);

    const response = await request;
    this.cacheResponse(apiCall, key, response);

    return response;
  };
}
