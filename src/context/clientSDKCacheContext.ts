// Copyright 2020 Cognite AS
import { Asset, CogniteClient, IdEither, Timeseries } from '@cognite/sdk';
import { createContext } from 'react';

export interface ClientSDKCacheContextType
  extends Partial<typeof CogniteClient> {
  assets: ClientSDKCacheAssets;
  timeseries: ClientSDKCacheTimeseries;
}

export interface ClientSDKCacheAssets extends Partial<CogniteClient['assets']> {
  retrieve: (ids: IdEither[]) => Promise<Asset[]>;
}
export interface ClientSDKCacheTimeseries
  extends Partial<CogniteClient['timeseries']> {
  retrieve: (ids: IdEither[]) => Promise<Timeseries[]>;
}

export const ClientSDKCacheContext = createContext<ClientSDKCacheContextType | null>(
  null
);
