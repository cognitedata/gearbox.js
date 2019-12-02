import {
  AssetList,
  CogniteClient,
  IdEither,
  TimeSeriesList,
} from '@cognite/sdk';
import { createContext } from 'react';

export interface ClientSDKCacheContextType
  extends Partial<typeof CogniteClient> {
  assets: ClientSDKCacheAssets;
  timeseries: ClientSDKCacheTimeseries;
}

export interface ClientSDKCacheAssets extends Partial<CogniteClient['assets']> {
  retrieve: (ids: IdEither[]) => Promise<AssetList>;
}
export interface ClientSDKCacheTimeseries
  extends Partial<CogniteClient['timeseries']> {
  retrieve: (ids: IdEither[]) => Promise<TimeSeriesList>;
}

export const ClientSDKCacheContext = createContext<ClientSDKCacheContextType | null>(
  null
);
