import { CogniteClient } from '@cognite/sdk';
import { ClientSDKCache } from '../cache/ClientSDKCache';
import { ClientApiKeys, ClientApiTypes } from './types';

type CachedKeys = keyof ClientSDKCache;
type CachedTypes = ClientSDKCache[CachedKeys];

export const wrapInCacheProxy = (
  client: CogniteClient,
  cache: ClientSDKCache
): CogniteClient => {
  const clientHandler: ProxyHandler<CogniteClient> = {
    get(target, name: ClientApiKeys | CachedKeys) {
      if (cache[name as keyof ClientSDKCache]) {
        return new Proxy(
          cache[name as CachedKeys],
          apiHandler<CachedTypes, ClientApiTypes>(name as CachedKeys)
        );
      } else {
        return target[name as ClientApiKeys];
      }
    },
  };

  const apiHandler = <T extends CachedTypes, K extends ClientApiTypes>(
    name: CachedKeys
  ): ProxyHandler<T> => ({
    get(target: T, propKey: keyof T | keyof K) {
      return target[propKey as keyof T]
        ? target[propKey as keyof T]
        : (client[name as ClientApiKeys] as K)[propKey as keyof K];
    },
  });

  return new Proxy(client, clientHandler);
};
