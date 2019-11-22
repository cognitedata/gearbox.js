import { CogniteClient } from '@cognite/sdk';
import React from 'react';
import { ClientSDKContext } from '../../context/clientSDKContext';
import { ClientSDKCacheProvider } from './ClientSDKCacheProvider/ClientSDKCacheProvider';
import { ClientSDKProxyProvider } from './ClientSDKProxyProvider';

export interface ClientSDKProviderProps {
  client: CogniteClient;
  children: React.ReactNode;
}

export const ClientSDKProvider: React.FC<ClientSDKProviderProps> = ({
  client,
  children,
}) => (
  <ClientSDKContext.Provider value={client}>
    <ClientSDKCacheProvider client={client}>
      <ClientSDKProxyProvider client={client}>
        {children}
      </ClientSDKProxyProvider>
    </ClientSDKCacheProvider>
  </ClientSDKContext.Provider>
);
