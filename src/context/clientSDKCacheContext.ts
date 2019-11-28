import {
  AssetList,
  CogniteClient,
  IdEither,
  TimeSeriesList,
} from '@cognite/sdk';
import { AssetsAPI } from '@cognite/sdk/dist/src/resources/assets/assetsApi';
import { TimeSeriesAPI } from '@cognite/sdk/dist/src/resources/timeSeries/timeSeriesApi';
import { createContext } from 'react';

export interface ClientSDKCacheContextType
  extends Partial<typeof CogniteClient> {
  assets: ClientSDKCacheAssets;
  timeseries: ClientSDKCacheTimeseries;
}

export interface ClientSDKCacheAssets extends Partial<AssetsAPI> {
  retrieve: (ids: IdEither[]) => Promise<AssetList>;
}
export interface ClientSDKCacheTimeseries extends Partial<TimeSeriesAPI> {
  retrieve: (ids: IdEither[]) => Promise<TimeSeriesList>;
}

export const ClientSDKCacheContext = createContext<ClientSDKCacheContextType | null>(
  null
);
