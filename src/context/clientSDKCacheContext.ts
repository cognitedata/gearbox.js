import { AssetList, IdEither } from '@cognite/sdk';
import { createContext } from 'react';

export interface ClientSDKCacheContextType {
  assets: ClientSDKCacheAssets;
}

export interface ClientSDKCacheAssets {
  retrieve: (ids: IdEither[]) => Promise<AssetList>;
}

export const ClientSDKCacheContext = createContext<ClientSDKCacheContextType | null>(
  null
);
