import { CogniteClient } from '@cognite/sdk';
import React from 'react';
import { ClientSDKProxyContext } from '../../context/clientSDKProxyContext';
import { wrapInProxies } from '../../proxies/clientSDKProxies';

export interface ClientSDKProxyProviderProps {
  client: CogniteClient;
  children: React.ReactNode;
}

export const ClientSDKProxyProvider: React.FC<ClientSDKProxyProviderProps> = ({
  client,
  children,
}) => (
  <ClientSDKProxyContext.Provider value={wrapInProxies(client)}>
    {children}
  </ClientSDKProxyContext.Provider>
);
