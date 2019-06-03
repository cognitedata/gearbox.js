import {
  Asset,
  Assets,
  Datapoint,
  Datapoints,
  EventDataWithCursor,
  Events,
  FileListParams,
  FileMetadataWithCursor,
  Files,
  TimeSeries,
  TimeseriesWithCursor,
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
  timeseriesList,
} from '../../../mocks';
import { setupMocks as setupTimeseriesChartMocks } from '../../TimeseriesChart/stories/TimeseriesChart.stories';
import { AssetMeta } from '../AssetMeta';
import alternatePane from './alternatePane.md';
import basic from './basic.md';
import customCategorySort from './customCategorySort.md';
import customPriorityAndSort from './customPriorityAndSort.md';
import customPriorityCategory from './customPriorityCategory.md';
import customStyles from './customStyles.md';
import customTimeseriesChartMeta from './customTimeseriesChartMeta.md';
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

TimeSeries.list = async (): Promise<TimeseriesWithCursor> => {
  return { items: timeseriesList };
};

Datapoints.retrieveLatest = async (name: string): Promise<Datapoint> => {
  return {
    timestamp: Date.now(),
    value: name.length + Math.random() * 5.0, // just random number
  };
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
  () => {
    setupTimeseriesChartMocks();
    return <AssetMeta assetId={4650652196144007} />;
  },
  {
    readme: {
      content: fullDescription,
    },
  }
);

storiesOf('AssetMeta/Examples', module)
  .add(
    'Basic',
    () => {
      setupTimeseriesChartMocks();
      return <AssetMeta assetId={4650652196144007} />;
    },
    {
      readme: {
        content: basic,
      },
    }
  )
  .add(
    'Returns selected pane',
    () => {
      setupTimeseriesChartMocks();
      return (
        <AssetMeta assetId={4650652196144007} onPaneChange={onPaneChange} />
      );
    },
    {
      readme: {
        content: selectedPane,
      },
    }
  )
  .add(
    'Alternate default tab',
    () => {
      setupTimeseriesChartMocks();
      return <AssetMeta assetId={4650652196144007} tab="documents" />;
    },
    {
      readme: {
        content: alternatePane,
      },
    }
  )
  .add(
    'Hide a tab',
    () => {
      setupTimeseriesChartMocks();
      return (
        <AssetMeta
          assetId={4650652196144007}
          tab="events"
          hidePanels={['details']}
        />
      );
    },
    {
      readme: {
        content: hideTab,
      },
    }
  )
  .add(
    'Returns selected document',
    () => {
      setupTimeseriesChartMocks();
      return <AssetMeta assetId={123} docsProps={{ handleDocumentClick }} />;
    },
    {
      readme: {
        content: selectedDocument,
      },
    }
  )
  .add(
    'Custom priority categories',
    () => {
      setupTimeseriesChartMocks();
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
      setupTimeseriesChartMocks();
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
      setupTimeseriesChartMocks();
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
    'Custom TimeseriesChartMeta',
    () => {
      setupTimeseriesChartMocks();
      return (
        <AssetMeta
          assetId={123}
          timeseriesProps={{
            defaultTimePeriod: 'lastYear',
            showMetadata: false,
            showDatapoint: false,
            showDescription: false,
            liveUpdate: false,
          }}
        />
      );
    },
    {
      readme: {
        content: customTimeseriesChartMeta,
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
