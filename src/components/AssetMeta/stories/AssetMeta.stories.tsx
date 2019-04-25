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
import { Document } from '../../../interfaces';
import { ASSET_DATA, DOCUMENTS, EVENTS } from '../../../mocks';
import { AssetMeta } from '../AssetMeta';
import alternatePane from './alternatePane.md';
import basic from './basic.md';
import fullDescription from './full.md';
import hideTab from './hideTab.md';
import selectedDocument from './selectedDocument.md';
import selectedPane from './selectedPane.md';

Assets.retrieve = (): Promise<Asset> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(ASSET_DATA);
    }, 1000); // simulate load delay
  });
};

Events.list = async (): Promise<EventDataWithCursor> => {
  return { items: EVENTS };
};

Files.list = async (): Promise<FileMetadataWithCursor> => {
  return { items: DOCUMENTS };
};

const onPaneChange = (key: string) => action('onPaneChange')(key);
const handleDocumentClick = (
  document: Document,
  category: string,
  description: string
) => {
  action('handleDocumentClick')(document, category, description);
};

storiesOf('AssetMeta', module).add(
  'Full Description',
  () => <AssetMeta assetId={4650652196144007} />,
  {
    readme: {
      content: fullDescription,
    },
    info: {
      header: false,
      source: false,
      styles: {
        infoBody: { display: 'none' },
      },
    },
  }
);

storiesOf('AssetMeta/Examples', module)
  .addParameters({
    info: {
      header: false,
      source: false,
      styles: {
        infoBody: { display: 'none' },
      },
    },
  })
  .add('Basic', () => <AssetMeta assetId={4650652196144007} />, {
    readme: {
      content: basic,
    },
  })
  .add(
    'Return selected pane',
    () => <AssetMeta assetId={4650652196144007} onPaneChange={onPaneChange} />,
    {
      readme: {
        content: selectedPane,
      },
    }
  )
  .add(
    'Alternate default tab',
    () => <AssetMeta assetId={4650652196144007} tab="documents" />,
    {
      readme: {
        content: alternatePane,
      },
    }
  )
  .add(
    'Hide a tab',
    () => (
      <AssetMeta
        assetId={4650652196144007}
        tab="events"
        hidePanels={['details']}
      />
    ),
    {
      readme: {
        content: hideTab,
      },
    }
  )
  .add(
    'Returns selected document',
    () => <AssetMeta assetId={123} docsProps={{ handleDocumentClick }} />,
    {
      readme: {
        content: selectedDocument,
      },
    }
  );
