import { CogniteClient } from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { fakeEvents } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { AssetEventsPanel } from '../AssetEventsPanel';
import customColumnNames from './customColumnNames.md';
import customSpinner from './customSpinner.md';
import customStyles from './customStyles.md';
import fullDescription from './full.md';
import loadCallback from './loadCallback.md';

const fakeClient: CogniteClient = {
  events: {
    // @ts-ignore
    list: () => ({
      autoPagingToArray: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(fakeEvents);
          }, 1000);
        });
      },
    }),
  },
};

const clientSDKDecorator = (storyFn: any) => (
  <ClientSDKProvider client={fakeClient}>{storyFn()}</ClientSDKProvider>
);

storiesOf('AssetEventsPanel', module)
  .addDecorator(clientSDKDecorator)
  .add(
    'Full Description',
    () => {
      return <AssetEventsPanel assetId={4650652196144007} />;
    },
    {
      readme: {
        content: fullDescription,
      },
    }
  );

storiesOf('AssetEventsPanel/Examples', module)
  .addDecorator(clientSDKDecorator)
  .add(
    'With load callback',
    () => {
      return (
        <AssetEventsPanel
          assetId={4650652196144007}
          onAssetEventsLoaded={action('onAssetEventsLoaded')}
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
        <AssetEventsPanel
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
    'Custom colum names',
    () => {
      return (
        <AssetEventsPanel
          assetId={4650652196144007}
          columns={[
            {
              title: 'Name',
              dataIndex: 'typeAndSubtype',
              key: 'typeAndSubtype',
            },
            {
              title: 'Custom Description',
              dataIndex: 'description',
              key: 'description',
            },
            {
              title: 'From',
              dataIndex: 'start',
              key: 'start',
            },
            {
              title: 'To',
              dataIndex: 'end',
              key: 'end',
            },
          ]}
        />
      );
    },
    {
      readme: {
        content: customColumnNames,
      },
    }
  )
  .add(
    'With custom styles',
    () => {
      return (
        <AssetEventsPanel
          assetId={4650652196144007}
          styles={{
            table: { border: '1px solid red' },
            tableRow: { borderBottom: '2px solid #999' },
            tableCell: { backgroundColor: '#DDD' },
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
