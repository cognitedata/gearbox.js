import { CogniteClient } from '@cognite/sdk';
import { version } from '../../package.json';
import { ClientSDKContextType } from '../context/clientSDKContext';

// Exclude 'project' cause it returns string from SDK instance and doesn't make
// any request to API
type ClientApiName = Exclude<keyof CogniteClient, 'project'>;
type ClientApi = CogniteClient[ClientApiName];

const GearboxHeader = `CogniteGearbox:${version}`;
const excludeMethods = ['setOneTimeSdkHeader', 'project'];

function getComponentHeader(component: string) {
  return `${GearboxHeader}/${component}`;
}

export function wrapInLogProxy(
  client: ClientSDKContextType,
  componentName: string
): ClientSDKContextType {
  const clientHandler: ProxyHandler<CogniteClient> = {
    get(target, name: ClientApiName) {
      if (target[name] && !excludeMethods.includes(name)) {
        return new Proxy(target[name], createApiHandler());
      } else {
        return target[name];
      }
    },
  };

  const createApiHandler = <T extends ClientApi>(): ProxyHandler<T> => ({
    get(target: T, propKey: keyof T) {
      const originalProperty = target[propKey];
      if (typeof originalProperty === 'function') {
        return <Args>(...args: Args[]) => {
          if (client!.setOneTimeSdkHeader) {
            client!.setOneTimeSdkHeader(getComponentHeader(componentName));
          }
          return originalProperty(...args);
        };
      } else {
        return originalProperty;
      }
    },
  });

  return client ? new Proxy(client, clientHandler) : client;
}
