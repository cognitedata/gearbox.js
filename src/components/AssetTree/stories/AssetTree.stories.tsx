import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { OnSelectAssetTreeParams } from '../../../interfaces';
import { ASSET_LIST_CHILD, ASSET_ZERO_DEPTH_ARRAY } from '../../../mocks';
import { AssetTree } from '../AssetTree';

import * as basic from './basic.md';
import * as clickItem from './clickItem.md';
import * as defaultExpanded from './defaultExpanded.md';
import * as fullDescription from './full.md';

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
    info: {
      header: false,
      source: false,
      styles: {
        infoBody: { display: 'none' },
      },
    },
  }
);

storiesOf('AssetTree/Examples', module)
  .addParameters({
    info: {
      header: false,
      source: false,
      styles: {
        infoBody: { display: 'none' },
      },
    },
  })
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
