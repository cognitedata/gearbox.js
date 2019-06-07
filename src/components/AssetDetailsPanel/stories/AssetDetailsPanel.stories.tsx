import { Asset, Assets } from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { ASSET_DATA } from '../../../mocks';
import { AssetDetailsPanel } from '../AssetDetailsPanel';
import customSpinner from './customSpinner.md';
import customStyles from './customStyles.md';
import fullDescription from './full.md';
import loadCallback from './loadCallback.md';

Assets.retrieve = (): Promise<Asset> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(ASSET_DATA);
    }, 1000);
  });
};

storiesOf('AssetDetailsPanel', module).add(
  'Full Description',
  () => {
    return <AssetDetailsPanel assetId={4650652196144007} />;
  },
  {
    readme: {
      content: fullDescription,
    },
  }
);

storiesOf('AssetDetailsPanel/Examples', module)
  .add(
    'With load callback',
    () => {
      return (
        <AssetDetailsPanel
          assetId={4650652196144007}
          onAssetLoaded={action('onAssetLoaded')}
        />
      );
    },
    {
      readme: {
        content: loadCallback,
      },
    }
  )
  .add(
    'With custom spinner',
    () => {
      return (
        <AssetDetailsPanel
          assetId={4650652196144007}
          customSpinner={<div>Loading...</div>}
        />
      );
    },
    {
      readme: {
        content: customSpinner,
      },
    }
  )
  .add(
    'With custom styles',
    () => {
      return (
        <AssetDetailsPanel
          assetId={4650652196144007}
          styles={{ border: '1px solid red' }}
        />
      );
    },
    {
      readme: {
        content: customStyles,
      },
    }
  );
