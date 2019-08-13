import { CogniteClient } from '@cognite/sdk';
import React from 'react';
import { ClientSDKContext } from '../../context/clientSDKContext';

export interface ClientSDKProviderProps {
  client: CogniteClient;
  children: React.ReactNode;
}

export const ClientSDKProvider: React.SFC<ClientSDKProviderProps> = ({
  client,
  children,
}) => (
  <ClientSDKContext.Provider value={client}>
    {children}
  </ClientSDKContext.Provider>
);
