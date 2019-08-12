import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { DOCUMENTS } from '../../../mocks';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { AssetDocumentsPanel } from '../AssetDocumentsPanel';
import categoryNames from './categoryNames.md';
import customSpinner from './customSpinner.md';
import customStyles from './customStyles.md';
import fullDescription from './full.md';
import loadCallback from './loadCallback.md';

class CogniteClient extends MockCogniteClient {
  files: any = {
    list: () => ({
      autoPagingToArray: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(DOCUMENTS);
          }, 1000);
        });
      },
    }),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

const clientSDKDecorator = (storyFn: any) => (
  <ClientSDKProvider client={sdk}>{storyFn()}</ClientSDKProvider>
);

storiesOf('AssetDocumentsPanel', module)
  .addDecorator(clientSDKDecorator)
  .add(
    'Full Description',
    () => {
      return <AssetDocumentsPanel assetId={4650652196144007} />;
    },
    {
      readme: {
        content: fullDescription,
      },
    }
  );

storiesOf('AssetDocumentsPanel/Examples', module)
  .addDecorator(clientSDKDecorator)
  .add(
    'With load callback',
    () => {
      return (
        <AssetDocumentsPanel
          assetId={4650652196144007}
          onAssetFilesLoaded={action('onAssetFilesLoaded')}
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
        <AssetDocumentsPanel
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
    'Custom category names',
    () => {
      return (
        <AssetDocumentsPanel
          assetId={4650652196144007}
          docTypes={{ XB: 'My Category', XL: 'Another Custom Category' }}
        />
      );
    },
    {
      readme: {
        content: categoryNames,
      },
    }
  )
  .add(
    'With custom styles',
    () => {
      return (
        <AssetDocumentsPanel
          assetId={4650652196144007}
          styles={{
            wrapper: { border: '1px solid red' },
            fileContainer: { backgroundColor: '#DDD', padding: 8 },
            fileLink: { color: 'purple' },
            fileTitle: { color: 'magenta', fontSize: '1em' },
          }}
        />
      );
    },
    {
      readme: {
        content: customStyles,
      },
    }
  );
