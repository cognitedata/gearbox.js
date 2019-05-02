import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { OnSelectReturnType } from '../../interfaces';
import { ASSET_LIST_CHILD, ASSET_ZERO_DEPTH_ARRAY } from '../../mocks';
import { AssetTree } from './AssetTree';

const setupMocks = () => {
  sdk.Assets.list = async (query: sdk.AssetListParams) => {
    return { items: ASSET_ZERO_DEPTH_ARRAY };
  };

  sdk.Assets.listDescendants = async (
    assetId: number,
    query: sdk.AssetListDescendantsParams
  ) => {
    return {
      items: ASSET_LIST_CHILD.sort((a, b) => (a.id === assetId ? -1 : 1)),
    };
  };
};
const zeroChild = ASSET_ZERO_DEPTH_ARRAY.findIndex(asset => asset.depth === 0);

storiesOf('AssetTree', module)
  .add('basic', () => {
    setupMocks();
    return <AssetTree />;
  })
  .add('Default expanded node', () => {
    setupMocks();

    return (
      <AssetTree
        defaultExpandedKeys={[String(ASSET_ZERO_DEPTH_ARRAY[zeroChild].id)]}
      />
    );
  })
  .add(
    'Click item in tree',
    () => {
      setupMocks();
      return (
        <AssetTree
          onSelect={(e: OnSelectReturnType) => action('onSelect')(e)}
        />
      );
    },
    {
      info: {
        text: 'onSelect returns the selected object (see action logger).',
      },
    }
  );
