import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { OnSelectAssetTreeParams } from '../../../interfaces';
import { ASSET_LIST_CHILD, ASSET_ZERO_DEPTH_ARRAY } from '../../../mocks';
import { AssetTree } from '../AssetTree';

import basic from './basic.md';
import clickItem from './clickItem.md';
import defaultExpanded from './defaultExpanded.md';
import fullDescription from './full.md';

const setupMocks = () => {
  sdk.Assets.list = async (_: sdk.AssetListParams) => {
    return { items: ASSET_ZERO_DEPTH_ARRAY };
  };

  sdk.Assets.listDescendants = async (assetId: number) => {
    return {
      items: ASSET_LIST_CHILD.sort(a => (a.id === assetId ? -1 : 1)),
    };
  };
};
const zeroChild = ASSET_ZERO_DEPTH_ARRAY.findIndex(asset => asset.depth === 0);

storiesOf('AssetTree', module).add(
  'Full description',
  () => {
    setupMocks();
    return <AssetTree />;
  },
  {
    readme: {
      content: fullDescription,
    },
  }
);

storiesOf('AssetTree/Examples', module)
  .add(
    'Basic',
    () => {
      setupMocks();
      return <AssetTree />;
    },
    {
      readme: {
        content: basic,
      },
    }
  )
  .add(
    'Default expanded node',
    () => {
      setupMocks();
      return (
        <AssetTree
          defaultExpandedKeys={[ASSET_ZERO_DEPTH_ARRAY[zeroChild].id]}
        />
      );
    },
    {
      readme: {
        content: defaultExpanded,
      },
    }
  )
  .add(
    'Click item in tree',
    () => {
      setupMocks();
      return (
        <AssetTree
          onSelect={(e: OnSelectAssetTreeParams) => action('onSelect')(e)}
        />
      );
    },
    {
      readme: {
        content: clickItem,
      },
    }
  );
