import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { OnSelectAssetTreeParams } from '../../../interfaces';
import {
  ASSET_LIST_CHILD,
  ASSET_TREE_STYLES,
  ASSET_ZERO_DEPTH_ARRAY,
} from '../../../mocks';
import { AssetTree } from '../AssetTree';

import * as basic from './basic.md';
import * as clickItem from './clickItem.md';
import * as customStyles from './customStyles.md';
import * as defaultExpanded from './defaultExpanded.md';
import * as fullDescription from './full.md';

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
  )
  .add(
    'Custom Styles',
    () => {
      setupMocks();
      return <AssetTree styles={ASSET_TREE_STYLES} />;
    },
    {
      readme: {
        content: customStyles,
      },
    }
  );
