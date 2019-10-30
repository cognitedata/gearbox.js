import CogniteClient from '@cognite/sdk/dist/src/cogniteClient';
import React from 'react';
import { ERROR_NO_SDK_CLIENT } from '../../../constants/errorMessages';
import { ClientSDKCacheContext } from '../../../context/clientSDKCacheContext';
import { ClientSDKCache } from './ClientSDKCache';

interface ClientSDKCacheProviderProps {
  children: React.ReactNode;
  client: CogniteClient;
}

export const ClientSDKCacheProvider: React.FC<ClientSDKCacheProviderProps> = ({
  children,
  client,
}) => {
  const cache = client ? new ClientSDKCache(client) : null;

  if (!client) {
    console.error(ERROR_NO_SDK_CLIENT);
  }

  return (
    <ClientSDKCacheContext.Provider value={cache}>
      {children}
    </ClientSDKCacheContext.Provider>
  );
};
