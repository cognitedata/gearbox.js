import {
  AssetList,
  CogniteClient,
  ExternalId,
  IdEither,
  InternalId,
} from '@cognite/sdk';
import { ClientSDKCacheAssets } from '../../../../context/clientSDKCacheContext';

export class CacheAssets implements ClientSDKCacheAssets {
  private client: CogniteClient;
  private requests: { [name: string]: Map<string, Promise<any>> } = {};
  private responses: { [name: string]: Map<any, any> } = {};

  constructor(client: CogniteClient) {
    this.client = client;
  }

  async retrieve(ids: IdEither[]): Promise<AssetList> {
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

    const request = this.client.assets.retrieve(ids);
    this.cacheRequest(apiCall, key, request);

    const response = await request;
    this.cacheResponse(apiCall, key, response);

    return response;
  }

  private handleFirstCallToCache(key: string) {
    if (this.requests[key] || this.responses[key]) {
      return;
    }

    this.requests[key] = new Map();
    this.responses[key] = new Map();
  }

  private checkCachedValue(
    apiCall: string,
    key: string
  ): { value: any } | null {
    const request = this.requests[apiCall].get(key);

    if (request) {
      return { value: request };
    }

    const response = this.responses[apiCall].get(key);

    if (response) {
      return { value: response };
    }

    return null;
  }

  private cacheRequest(apiCall: string, key: string, request: Promise<any>) {
    this.requests[apiCall].set(key, request);
  }

  private cacheResponse(apiCall: string, key: string, response: any) {
    this.responses[apiCall].set(key, response);
    this.requests[apiCall].delete(key);
  }
}
