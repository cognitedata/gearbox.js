import { CogniteClient } from '@cognite/sdk';
import { ClientSDKCache } from '../cache/ClientSDKCache';
import { ClientSDKContextType } from '../context/clientSDKContext';
import { ClientSDKProxyContextType } from '../context/clientSDKProxyContext';
import { wrapInCacheProxy } from './clientSDKCacheProxy';
import { wrapInLogProxy } from './clientSDKLogProxy';

export function wrapInProxies(
  client: ClientSDKContextType
): ClientSDKProxyContextType {
  const sdkCache = client ? new ClientSDKCache(client) : client;

  const cachedClient = sdkCache
    ? wrapInCacheProxy(client as CogniteClient, sdkCache)
    : client;

  return (component: string, cache = false) => {
    const sdkClient = cache && cachedClient ? cachedClient : client;

    return sdkClient ? wrapInLogProxy(sdkClient, component) : sdkClient;
  };
}
