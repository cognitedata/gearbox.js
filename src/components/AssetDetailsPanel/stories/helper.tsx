import { Asset } from '@cognite/sdk';
import React from 'react';
import { fakeAsset, MockCogniteClient } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    retrieve: () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve([fakeAsset]);
        }, 1000);
      }),
  };
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const customStyle: React.CSSProperties = {
  border: '1px solid red',
};

export const toCategory = (name: string): string => name.split('_')[0];

export const onAssetLoaded = (asset: Asset) => {
  console.log(asset);
};
