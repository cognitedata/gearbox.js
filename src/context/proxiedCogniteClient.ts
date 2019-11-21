import { CogniteClient } from '@cognite/sdk';
import { version } from '../../package.json';

const apiNames = [
  'assets',
  'timeseries',
  'datapoints',
  'sequences',
  'events',
  'files',
  'raw',
  'projects',
  'groups',
  'securityCategories',
  'serviceAccounts',
  'models3D',
  'revisions3D',
  'files3D',
  'assetMappings3D',
  'viewer3D',
  'apiKeys',
  'login',
  'logout',
] as const;

type ClientApiName = typeof apiNames[number];
type ClientApi = CogniteClient[ClientApiName];

const GearboxHeader = `CogniteGearbox:${version}`;

function getComponentHeader(component: string) {
  return `${GearboxHeader}/${component}`;
}

export function wrapInProxy(client: CogniteClient | null) {
  let componentName: string;

  const clientHandler: ProxyHandler<CogniteClient> = {
    get(target, name: ClientApiName) {
      if (apiNames.includes(name)) {
        return new Proxy(target[name], createApiHandler());
      } else {
        return target[name];
      }
    },
  };

  function createApiHandler<T extends ClientApi>(): ProxyHandler<T> {
    return {
      get(target: T, propKey: keyof T) {
        const originalProperty = target[propKey];
        if (typeof originalProperty === 'function') {
          return <Args>(...args: Args[]) => {
            client!.setOneTimeSdkHeader(getComponentHeader(componentName));
            return originalProperty(...args);
          };
        } else {
          return originalProperty;
        }
      },
    };
  }

  return function forComponent(component: string) {
    componentName = component;
    return client ? new Proxy(client, clientHandler) : client;
  };
}
