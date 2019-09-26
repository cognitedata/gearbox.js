import { storiesOf } from '@storybook/react';
import React from 'react';
import {
  ASSET_LIST_CHILD,
  ASSET_ZERO_DEPTH_ARRAY,
} from '../../../mocks/assetsListV2';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { AssetBreadcrumb } from '../AssetBreadcrumb';
import fullDescription from './full.md';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    retrieve: (ids: any) =>
      new Promise(resolve => {
        setTimeout(() => {
          const allAssets = [...ASSET_ZERO_DEPTH_ARRAY, ...ASSET_LIST_CHILD];
          const id = ids[0].id;
          for (const asset of allAssets) {
            if (asset.id === id) {
              resolve([asset]);
              return;
            }
          }
        }, 1000);
      }),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

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
