// Copyright 2020 Cognite AS
import React, { FC } from 'react';
import { ClientSDKContext } from '../../context/clientSDKContext';
import { ClientSDKProxyProvider } from './ClientSDKProxyProvider';
import { ClientSDKProviderProps } from './interfaces';

export const ClientSDKProvider: FC<ClientSDKProviderProps> = ({
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
