import React from 'react';
import {
  ASSET_LIST_CHILD,
  ASSET_ZERO_DEPTH_ARRAY,
  MockCogniteClient,
  sleep,
} from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { OnSelectAssetTreeParams } from '../interfaces';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    // @ts-ignore
    list: scope => ({
      autoPagingToArray: async () => {
        await sleep(300);
        if (scope && scope.filter && scope.filter.parentIds) {
          const { parentIds } = scope.filter;
          return ASSET_LIST_CHILD.filter(a => a.parentId === parentIds[0]);
        }
        return ASSET_ZERO_DEPTH_ARRAY;
      },
    }),
    retrieve: async (ids: { id: number }[]) => {
      await sleep(300);
      const allAssets = [...ASSET_ZERO_DEPTH_ARRAY, ...ASSET_LIST_CHILD];
      return ids.map(({ id }) => allAssets.find(asset => asset.id === id));
    },
  };
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const onSelect = (e: OnSelectAssetTreeParams) => console.log(e);

export const customStyle = {
  list: {
    fontFamily: 'Courier New',
    fontSize: 'large',
  },
};

export const exampleTheme = {
  gearbox: {
    fontFamily: 'Courier New',
    fontSize: 'large',
    textColor: '#a88400',
    highlightColor: '#00b893',
  },
};

export const displayIdAsName = ({ id }: { id: number }) => `Id: ${id}`;
