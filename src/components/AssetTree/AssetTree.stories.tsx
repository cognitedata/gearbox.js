import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React from 'react';
import AssetTree from 'components/AssetTree/AssetTree';
import { ASSET_ZERO_DEPTH_ARRAY, ASSET_LIST_CHILD } from 'mocks/assetsList';

const returnLoadData = () => {
  return ASSET_LIST_CHILD;
};

const zeroChild = ASSET_LIST_CHILD.findIndex(asset => asset.depth === 0);

storiesOf('AssetTree', module)
  .add('All data on mount', () => <AssetTree assets={ASSET_LIST_CHILD} />)
  .add('Default expanded node', () => (
    <AssetTree
      assets={ASSET_LIST_CHILD}
      defaultExpandedKeys={[String(ASSET_LIST_CHILD[zeroChild].id)]}
    />
  ))
  .add(
    'Add data onLoad',
    () => (
      <AssetTree assets={ASSET_ZERO_DEPTH_ARRAY} loadData={returnLoadData} />
    ),
    {
      info: {
        text:
          'loadData Should return a list of assets. Typically a call to listDescendants.',
      },
    }
  )
  .add(
    'Click item in tree',
    () => (
      <AssetTree
        assets={ASSET_ZERO_DEPTH_ARRAY}
        loadData={returnLoadData}
        onSelect={e => action('onSelect')(e)}
      />
    ),
    {
      info: {
        text: 'onSelect returns the selected object (see action logger).',
      },
    }
  );
