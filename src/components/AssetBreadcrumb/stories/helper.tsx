import { Asset, CogniteInternalId } from '@cognite/sdk';
import React, { FC } from 'react';
import {
  ASSET_LIST_CHILD,
  ASSET_ZERO_DEPTH_ARRAY,
  MockCogniteClient,
  sleep,
} from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { AssetBreadcrumbProps } from '../interfaces';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    retrieve: async (ids: { id: number }[]) => {
      await sleep(200);
      const allAssets = [...ASSET_ZERO_DEPTH_ARRAY, ...ASSET_LIST_CHILD];
      const result = ids.map(({ id }) => {
        return allAssets.find(asset => asset.id === id);
      });
      return result || [];
    },
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

export const retrieveAsset = async (assetId: CogniteInternalId) => {
  await sleep(100);
  return ASSET_LIST_CHILD.find(asset => asset.id === assetId);
};

export const ComponentProps: FC<AssetBreadcrumbProps> = () => <></>;
