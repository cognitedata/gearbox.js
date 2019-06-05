import { Asset, Assets } from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { ASSET_DATA } from '../../../mocks';
import { setupMocks as setupTimeseriesChartMocks } from '../../TimeseriesChart/stories/TimeseriesChart.stories';
import { AssetDetailsPanel } from '../AssetDetailsPanel';

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
    setupTimeseriesChartMocks();
    return <AssetDetailsPanel assetId={4650652196144007} />;
  },
  {
    readme: {
      content: '',
    },
  }
);

storiesOf('AssetDetailsPanel/Examples', module)
  .add(
    'With custom styles',
    () => {
      setupTimeseriesChartMocks();
      return (
        <AssetDetailsPanel
          assetId={4650652196144007}
          styles={{ border: '1px solid red' }}
        />
      );
    },
    {
      readme: {
        content: '',
      },
    }
  )
  .add(
    'With load callback',
    () => {
      setupTimeseriesChartMocks();
      return (
        <AssetDetailsPanel
          assetId={4650652196144007}
          onAssetLoaded={action('onAssetLoaded')}
        />
      );
    },
    {
      readme: {
        content: '',
      },
    }
  )
  .add(
    'With custom spinner',
    () => {
      setupTimeseriesChartMocks();
      return (
        <AssetDetailsPanel
          assetId={4650652196144007}
          customSpinner={<div>Loading...</div>}
        />
      );
    },
    {
      readme: {
        content: '',
      },
    }
  );
