import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { DOCUMENTS } from '../../../mocks';
import { AssetTimeseriesPanel } from '../AssetTimeseriesPanel';
import customSpinner from './customSpinner.md';
import customTimeseriesChartMeta from './customTimeseriesChartMeta.md';
import fullDescription from './full.md';
import loadCallback from './loadCallback.md';

sdk.Files.list = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ items: DOCUMENTS });
    }, 1000);
  });
};

storiesOf('AssetTimeseriesPanel', module).add(
  'Full Description',
  () => {
    return <AssetTimeseriesPanel assetId={4650652196144007} />;
  },
  {
    readme: {
      content: fullDescription,
    },
  }
);

storiesOf('AssetTimeseriesPanel/Examples', module)
  .add(
    'With load callback',
    () => {
      return (
        <AssetTimeseriesPanel
          assetId={4650652196144007}
          onAssetTimeseriesLoaded={action('onAssetTimeseriesLoaded')}
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
        <AssetTimeseriesPanel
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
    'Custom TimeseriesChartMeta',
    () => {
      return (
        <AssetTimeseriesPanel
          assetId={4650652196144007}
          defaultTimePeriod="lastHour"
          liveUpdate={false}
          showChart={true}
          showDescription={false}
          showDatapoint={true}
          showMetadata={false}
          showPeriods={true}
        />
      );
    },
    {
      readme: {
        content: customTimeseriesChartMeta,
      },
    }
  );
