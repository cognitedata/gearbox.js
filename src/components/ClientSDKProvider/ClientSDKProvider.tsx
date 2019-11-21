import { CogniteClient } from '@cognite/sdk';
import React from 'react';
import { ClientSDKContext } from '../../context/clientSDKContext';
import { ClientSDKProxiedContext } from '../../context/clientSDKProxiedContext';
import { wrapInProxy } from '../../context/proxiedCogniteClient';
import { ClientSDKCacheProvider } from './ClientSDKCacheProvider/ClientSDKCacheProvider';

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
      <ClientSDKProxiedContext.Provider value={wrapInProxy(client)}>
        {children}
      </ClientSDKProxiedContext.Provider>
    </ClientSDKCacheProvider>
  </ClientSDKContext.Provider>
);
