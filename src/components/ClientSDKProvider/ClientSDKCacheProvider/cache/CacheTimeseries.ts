import { CogniteClient, ExternalId, IdEither, InternalId } from '@cognite/sdk';
import { TimeSeries } from '@cognite/sdk/dist/src/resources/classes/timeSeries';
import { ClientSDKCacheTimeseries } from '../../../../context/clientSDKCacheContext';
import { CacheBase } from './CacheBase';

export class CacheTimeseries extends CacheBase
  implements ClientSDKCacheTimeseries {
  private client: CogniteClient;

  constructor(client: CogniteClient) {
    super();
    this.client = client;
  }

  async retrieve(ids: IdEither[]): Promise<TimeSeries[]> {
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

    const request = this.client.timeseries.retrieve(ids);
    this.cacheRequest(apiCall, key, request);

    const response = await request;
    this.cacheResponse(apiCall, key, response);

    return response;
  }
}
