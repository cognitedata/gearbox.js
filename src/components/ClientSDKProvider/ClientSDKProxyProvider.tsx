// Copyright 2020 Cognite AS
import React, { FC } from 'react';
import { ClientSDKProxyContext } from '../../context/clientSDKProxyContext';
import { wrapInProxies } from '../../proxies/clientSDKProxies';
import { ClientSDKProviderProps } from './interfaces';

export const ClientSDKProxyProvider: FC<ClientSDKProviderProps> = ({
  client,
  children,
}) => (
  <ClientSDKProxyContext.Provider value={wrapInProxies(client)}>
    {children}
  </ClientSDKProxyContext.Provider>
);
