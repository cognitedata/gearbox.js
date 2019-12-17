import React from 'react';
import { OnSelectAssetTreeParams } from '../../../interfaces';
import { sleep } from '../../../mocks';
import {
  ASSET_LIST_CHILD,
  ASSET_ZERO_DEPTH_ARRAY,
} from '../../../mocks/assetsListV2';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';

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
