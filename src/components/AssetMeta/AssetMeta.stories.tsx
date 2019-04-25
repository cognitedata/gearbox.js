import {
  Asset,
  Assets,
  EventDataWithCursor,
  Events,
  FileMetadataWithCursor,
  Files,
} from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { ASSET_DATA, DOCUMENTS, EVENTS } from '../../mocks';
import { AssetMeta } from './AssetMeta';

Assets.retrieve = (): Promise<Asset> => {
  return new Promise(resolve => {
    setTimeout(() => {
      action('Assets.retrieve')();
      resolve(ASSET_DATA);
    }, 1000); // simulate load delay
  });
};

Events.list = async (): Promise<EventDataWithCursor> => {
  action('Events.list')();
  return { items: EVENTS };
};

Files.list = async (): Promise<FileMetadataWithCursor> => {
  action('Files.list')();
  return { items: DOCUMENTS };
};

const onPaneChange = (key: string) => action('onPaneChange')(key);

storiesOf('AssetMeta', module)
  .add('Minimal', () => <AssetMeta assetId={123} />)
  .add('Return selected pane', () => (
    <AssetMeta assetId={123} onPaneChange={onPaneChange} />
  ))
  .add('Alternate default tab', () => <AssetMeta assetId={123} tab="events" />)
  .add(
    'Hide a tab',
    () => <AssetMeta assetId={123} tab="events" hidePanels={['details']} />,
    {
      info: {
        text: 'You can define panels if you do not wat to display them.',
      },
    }
  );
