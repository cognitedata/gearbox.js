import { storiesOf } from '@storybook/react';
import React from 'react';
import AssetTree from 'components/AssetTree/AssetTree';
import { ASSET_ZERO_DEPTH_ARRAY, ASSET_LIST_CHILD } from 'mocks/assetsList';

const returnLoadData = () => {
  return ASSET_LIST_CHILD;
};

storiesOf('AssetTree', module)
  .add('Minimal', () => <AssetTree assets={ASSET_ZERO_DEPTH_ARRAY} />)
  .add('With onload', () => (
    <AssetTree assets={ASSET_ZERO_DEPTH_ARRAY} loadData={returnLoadData} />
  ));
