import { Asset } from '@cognite/sdk';
import React from 'react';
import {
  ASSET_LIST_CHILD,
  ASSET_ZERO_DEPTH_ARRAY,
} from '../../../mocks/assetsListV2';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    retrieve: (ids: { id: number }[]) =>
      new Promise(resolve => {
        setTimeout(() => {
          const allAssets = [...ASSET_ZERO_DEPTH_ARRAY, ...ASSET_LIST_CHILD];
          const result = ids.map(({ id }) => {
            return allAssets.find(asset => asset.id === id);
          });

          resolve(result || []);
        }, 200);
      }),
  };
}

export const Sdk = (obj: any) => {
  const { children } = obj;
  console.log(obj);
  return <ClientSDKProvider client={client}>{children}</ClientSDKProvider>;
};

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const customElementRendering = (
  asset: Asset,
  depth: number
): JSX.Element => (
  <span style={{ backgroundColor: 'red' }}>{`${depth}. ${asset.name ||
    'undefined'}`}</span>
);

export const handleAssetLoaded = (asset: Asset) => {
  console.log(asset);
};
