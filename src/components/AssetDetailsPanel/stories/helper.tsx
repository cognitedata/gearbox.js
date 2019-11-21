import { Asset } from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import CSS from 'csstype';
import React from 'react';
import { fakeAsset } from '../../../mocks';
import { MockCogniteClient } from '../../../utils/mockSdk';
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

export const customStyle: CSS.Properties = {
  border: '1px solid red',
};

export const toCategory = (name: string): string => name.split('_')[0];

export const onAssetLoaded = (asset: Asset) => {
  console.log(asset);
  action('handleAssetLoaded')(asset);
};
