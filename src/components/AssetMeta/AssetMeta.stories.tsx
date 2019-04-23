import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { ASSET_DATA, DOCUMENTS, EVENTS } from '../../mocks';
import { AssetMeta } from './AssetMeta';
import {
  Assets,
  Asset,
  Events,
  EventDataWithCursor,
  Files,
  FileMetadataWithCursor,
} from '@cognite/sdk';

Assets.retrieve = async (): Promise<Asset> => {
  action('Assets.retrieve')();
  return ASSET_DATA;
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
