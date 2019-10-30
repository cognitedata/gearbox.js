import { Asset } from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import {
  ASSET_LIST_CHILD,
  ASSET_ZERO_DEPTH_ARRAY,
} from '../../../mocks/assetsListV2';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { AssetBreadcrumb } from '../AssetBreadcrumb';
import customRendering from './custom-element-rendering.md';
import fullDescription from './full.md';
import handleCallbacks from './handle-callbacks.md';
import maxLength from './max-length.md';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    retrieve: (ids: any) =>
      new Promise(resolve => {
        setTimeout(() => {
          const allAssets = [...ASSET_ZERO_DEPTH_ARRAY, ...ASSET_LIST_CHILD];
          const id = ids[0].id;
          const result = allAssets.find(asset => asset.id === id);

          resolve(result ? [result] : []);
        }, 200);
      }),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });
const customElementRendering = (asset: Asset, depth: number) => (
  <span style={{ backgroundColor: 'red' }}>{`${depth}. ${asset.name ||
    'undefined'}`}</span>
);
const onBreadcrumbClick = (asset: Asset, depth: number) => {
  action('onBreadcrumbClick')(asset, depth);
};

const ClientSDKDecorator = (storyFn: any) => (
  <ClientSDKProvider client={sdk}>{storyFn()}</ClientSDKProvider>
);

storiesOf('AssetBreadcrumb', module)
  .addDecorator(ClientSDKDecorator)
  .add(
    'Full Description',
    () => {
      return <AssetBreadcrumb assetId={4518112062673878} />;
    },
    {
      readme: {
        content: fullDescription,
      },
    }
  );

storiesOf('AssetBreadcrumb/Examples', module)
  .addDecorator(ClientSDKDecorator)
  .add(
    'Set max length',
    () => {
      return <AssetBreadcrumb assetId={4518112062673878} maxLength={5} />;
    },
    {
      readme: {
        content: maxLength,
      },
    }
  )
  .add(
    'Custom element rendering',
    () => {
      return (
        <AssetBreadcrumb
          assetId={4518112062673878}
          maxLength={5}
          renderItem={customElementRendering}
        />
      );
    },
    {
      readme: {
        content: customRendering,
      },
    }
  )
  .add(
    'Handle callbacks',
    () => {
      return (
        <AssetBreadcrumb
          assetId={4518112062673878}
          onBreadcrumbClick={onBreadcrumbClick}
        />
      );
    },
    {
      readme: {
        content: handleCallbacks,
      },
    }
  );
