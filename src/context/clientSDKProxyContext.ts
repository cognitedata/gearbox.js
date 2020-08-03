// Copyright 2020 Cognite AS
import React, { useContext } from 'react';
import { ClientSDKContextType } from './clientSDKContext';

export type ClientSDKProxyContextType = (
  component: string,
  cache?: boolean
) => ClientSDKContextType;

export const ClientSDKProxyContext = React.createContext<
  ClientSDKProxyContextType
>(() => null);

export function useCogniteContext<
  C extends React.ComponentType<React.ComponentProps<C>>
>(component: C, cache: boolean = false) {
  return useContext(ClientSDKProxyContext)(component.displayName || '', cache);
}
