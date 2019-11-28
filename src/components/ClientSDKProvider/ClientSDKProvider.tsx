import { CogniteClient } from '@cognite/sdk';
import React from 'react';
import { ClientSDKContext } from '../../context/clientSDKContext';
import { ClientSDKProxyProvider } from './ClientSDKProxyProvider';

export interface ClientSDKProviderProps {
  client: CogniteClient;
  children: React.ReactNode;
}

export const ClientSDKProvider: React.FC<ClientSDKProviderProps> = ({
  client,
  children,
}) => {
  return (
    <ClientSDKContext.Provider value={client}>
      <ClientSDKProxyProvider client={client}>
        {children}
      </ClientSDKProxyProvider>
    </ClientSDKContext.Provider>
  );
};
