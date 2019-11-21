import { CogniteClient } from '@cognite/sdk';
import React, { useContext } from 'react';

export type ClientSDKProxiedContextType = (
  component: string
) => CogniteClient | null;

export const ClientSDKProxiedContext = React.createContext<
  ClientSDKProxiedContextType
>(() => null);

export function useCogniteContext<
  C extends React.ComponentType<React.ComponentProps<C>>
>(component: C) {
  return useContext(ClientSDKProxiedContext)(component.displayName || '');
}
