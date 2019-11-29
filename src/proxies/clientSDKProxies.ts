import { ClientSDKCache } from '../cache/ClientSDKCache';
import { ClientSDKContextType } from '../context/clientSDKContext';
import { ClientSDKProxyContextType } from '../context/clientSDKProxyContext';
import { wrapInCacheProxy } from './clientSDKCacheProxy';
import { wrapInLogProxy } from './clientSDKLogProxy';

export function wrapInProxies(
  client: ClientSDKContextType
): ClientSDKProxyContextType {
  const sdkCache = client ? new ClientSDKCache(client) : client;

  return (component: string, cache = false) => {
    const sdkClient = client ? wrapInLogProxy(client, component) : client;

    if (cache && sdkCache && sdkClient) {
      sdkCache.swapClient(sdkClient);

      return wrapInCacheProxy(sdkClient, sdkCache);
    }

    return sdkClient;
  };
}
