import {
  Asset,
  Assets,
  EventDataWithCursor,
  Events,
  FileListParams,
  FileMetadataWithCursor,
  Files,
} from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { Document } from '../../../interfaces';
import {
  ASSET_DATA,
  ASSET_META_STYLES,
  DOCUMENTS,
  EVENTS,
} from '../../../mocks';
import { AssetMeta } from '../AssetMeta';
import alternatePane from './alternatePane.md';
import basic from './basic.md';
import customCategorySort from './customCategorySort.md';
import customPriorityAndSort from './customPriorityAndSort.md';
import customPriorityCategory from './customPriorityCategory.md';
import customStyles from './customStyles.md';
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

Files.list = async ({
  assetId,
}: FileListParams): Promise<FileMetadataWithCursor> => {
  if (assetId === 12345) {
    return { items: [] }; // simulate asset without documents
  }
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
  }
);

storiesOf('AssetMeta/Examples', module)
  .add('Basic', () => <AssetMeta assetId={4650652196144007} />, {
    readme: {
      content: basic,
    },
  })
  .add(
    'Returns selected pane',
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
  )
  .add(
    'Custom priority categories',
    () => {
      return (
        <AssetMeta
          assetId={123}
          docsProps={{ categoryPriorityList: ['AB', 'ZE'] }}
        />
      );
    },
    {
      readme: {
        content: customPriorityCategory,
      },
    }
  )
  .add(
    'Custom categories sort',
    () => {
      const customSort = (a: string, b: string) => (a > b ? -1 : a < b ? 1 : 0);
      return (
        <AssetMeta
          assetId={123}
          docsProps={{
            customCategorySort: customSort,
            categoryPriorityList: [],
          }}
        />
      );
    },
    {
      readme: {
        content: customCategorySort,
      },
    }
  )
  .add(
    'Custom category priority and sort',
    () => {
      const customSort = (a: string, b: string) => (a > b ? -1 : a < b ? 1 : 0);
      return (
        <AssetMeta
          assetId={123}
          docsProps={{
            customCategorySort: customSort,
            categoryPriorityList: ['ZE'],
          }}
        />
      );
    },
    {
      readme: {
        content: customPriorityAndSort,
      },
    }
  )
  .add(
    'Custom Styles',
    () => {
      return <AssetMeta assetId={123456} styles={ASSET_META_STYLES} />;
    },
    {
      readme: {
        content: customStyles,
      },
    }
  );
