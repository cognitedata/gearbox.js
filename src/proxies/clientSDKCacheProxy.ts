import { CogniteClient } from '@cognite/sdk';
import { ClientSDKCache } from '../cache/ClientSDKCache';

type CachedKeys = keyof ClientSDKCache;
type SDKKeys = Exclude<keyof CogniteClient, 'project'>;
type CachedTypes = ClientSDKCache[CachedKeys];
type SDKTypes = CogniteClient[SDKKeys];

export const wrapInCacheProxy = (
  client: CogniteClient,
  cache: ClientSDKCache
): CogniteClient => {
  const clientHandler: ProxyHandler<CogniteClient> = {
    get(target, name: SDKKeys | CachedKeys) {
      if (cache[name as keyof ClientSDKCache]) {
        return new Proxy(
          cache[name as CachedKeys],
          apiHandler<CachedTypes, SDKTypes>(name as CachedKeys)
        );
      } else {
        return target[name];
      }
    },
  };

  const apiHandler = <T extends CachedTypes, K extends SDKTypes>(
    name: CachedKeys
  ): ProxyHandler<T> => ({
    get(target: T, propKey: keyof T | keyof K) {
      return target[propKey as keyof T]
        ? target[propKey as keyof T]
        : (client[name as SDKKeys] as K)[propKey as keyof K];
    },
  });

  return new Proxy(client, clientHandler);
};
