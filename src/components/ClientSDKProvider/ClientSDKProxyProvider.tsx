import { CogniteClient } from '@cognite/sdk';
import React from 'react';
import { ClientSDKProxyContext } from '../../context/clientSDKProxyContext';
import { wrapInProxy } from '../../context/proxyCogniteClient';

export interface ClientSDKProxyProviderProps {
  client: CogniteClient;
  children: React.ReactNode;
}

export const ClientSDKProxyProvider: React.FC<ClientSDKProxyProviderProps> = ({
  client,
  children,
}) => (
  <ClientSDKProxyContext.Provider value={wrapInProxy(client)}>
    {children}
  </ClientSDKProxyContext.Provider>
);
