import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { fakeAsset } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { AssetDetailsPanel } from '../AssetDetailsPanel';
import customSpinner from './customSpinner.md';
import customStyles from './customStyles.md';
import fullDescription from './full.md';
import loadCallback from './loadCallback.md';

const fakeClient: API = {
  // @ts-ignore
  assets: {
    retrieve: () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve([fakeAsset]);
        }, 1000);
      }),
  },
};

const ClientSDKDecorator = (storyFn: any) => (
  <ClientSDKProvider client={fakeClient}>{storyFn()}</ClientSDKProvider>
);

storiesOf('AssetDetailsPanel', module)
  .addDecorator(ClientSDKDecorator)
  .add(
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
  .addDecorator(ClientSDKDecorator)
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
