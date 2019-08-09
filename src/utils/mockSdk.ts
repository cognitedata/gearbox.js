import { CogniteClient } from '@cognite/sdk';

export class MockCogniteClient extends CogniteClient {
  constructor(options: any) {
    super(options);
    Object.defineProperty(this, 'assets', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'timeseries', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'datapoints', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'events', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'files', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'raw', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'projects', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'groups', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'securityCategories', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'serviceAccounts', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'models3D', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'revisions3D', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'files3D', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'assetMappings3D', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'viewer3D', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
    Object.defineProperty(this, 'apiKeys', {
      writable: true,
      enumerable: true,
      configurable: true,
      value: {},
    });
  }
}
