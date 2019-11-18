import { AssetList, IdEither } from '@cognite/sdk';
import { TimeSeries } from '@cognite/sdk/dist/src/resources/classes/timeSeries';
import { createContext } from 'react';

export interface ClientSDKCacheContextType {
  assets: ClientSDKCacheAssets;
  timeseries: ClientSDKCacheTimeseries;
}

export interface ClientSDKCacheAssets {
  retrieve: (ids: IdEither[]) => Promise<AssetList>;
}
export interface ClientSDKCacheTimeseries {
  retrieve: (ids: IdEither[]) => Promise<TimeSeries[]>;
}

export const ClientSDKCacheContext = createContext<ClientSDKCacheContextType | null>(
  null
);
