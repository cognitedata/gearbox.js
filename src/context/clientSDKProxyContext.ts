import React, { useContext } from 'react';
import { ClientSDKContextType } from './clientSDKContext';

export type ClientSDKProxyContextType = (
  component: string
) => ClientSDKContextType;

export const ClientSDKProxyContext = React.createContext<
  ClientSDKProxyContextType
>(() => null);

export function useCogniteContext<
  C extends React.ComponentType<React.ComponentProps<C>>
>(component: C) {
  return useContext(ClientSDKProxyContext)(component.displayName || '');
}
