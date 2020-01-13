import { Asset } from '@cognite/sdk';
import React, { FC } from 'react';
import {
  ASSET_LIST_CHILD,
  ASSET_ZERO_DEPTH_ARRAY,
  MockCogniteClient,
} from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { AssetBreadcrumbProps } from '../interfaces';

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

export const onBreadcrumbClick = (asset: Asset, depth: number) =>
  console.log(asset, depth);

export const ComponentProps: FC<AssetBreadcrumbProps> = () => <></>;
