import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import React from 'react';
import { ClientSDKContext } from '../../context/clientSDKContext';

export interface ClientSDKProviderProps {
  client: API;
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
