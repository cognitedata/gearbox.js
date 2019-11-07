import { AssetList, IdEither, TimeSeriesList } from '@cognite/sdk';
import { createContext } from 'react';

export interface ClientSDKCacheContextType {
  assets: ClientSDKCacheAssets;
  timeseries: ClientSDKCacheTimeseries;
}

export interface ClientSDKCacheAssets {
  retrieve: (ids: IdEither[]) => Promise<AssetList>;
}
export interface ClientSDKCacheTimeseries {
  retrieve: (ids: IdEither[]) => Promise<TimeSeriesList>;
}

export const ClientSDKCacheContext = createContext<ClientSDKCacheContextType | null>(
  null
);
