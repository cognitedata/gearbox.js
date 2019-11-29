import {
  CogniteClient,
  ExternalId,
  IdEither,
  InternalId,
  TimeSeriesList,
} from '@cognite/sdk';
import { ClientSDKCacheTimeseries } from '../../context/clientSDKCacheContext';
import { CacheBase } from './CacheBase';

export class CacheTimeseries extends CacheBase
  implements ClientSDKCacheTimeseries {
  private client: () => CogniteClient;

  constructor(client: () => CogniteClient) {
    super();
    this.client = client;
  }

  retrieve = async (ids: IdEither[]): Promise<TimeSeriesList> => {
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
    console.log(this.client());
    const request = this.client().timeseries.retrieve(ids);
    this.cacheRequest(apiCall, key, request);

    const response = await request;
    this.cacheResponse(apiCall, key, response);

    return response;
  };
}
