import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { Document } from '../../../interfaces';
import {
  ASSET_META_STYLES,
  DOCUMENTS,
  fakeAsset,
  fakeEvents,
  timeseriesListV2,
} from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import {
  MockDatapointsClientObject,
  MockTimeseriesClientObject,
  TimeseriesMockClient,
} from '../../TimeseriesChart/stories/TimeseriesChart.stories';
import { AssetMeta } from '../AssetMeta';
import alternatePane from './alternatePane.md';
import basic from './basic.md';
import customSpinner from './customSpinner.md';
import customStyles from './customStyles.md';
import customTimeseriesChartMeta from './customTimeseriesChartMeta.md';
import detailsCustomCategories from './detailsCustomCategories.md';
import docCustomCategorySort from './docCustomCategorySort.md';
import docCustomPriorityAndSort from './docCustomPriorityAndSort.md';
import docCustomPriorityCategory from './docCustomPriorityCategory.md';
import fullDescription from './full.md';
import hideTab from './hideTab.md';
import selectedDocument from './selectedDocument.md';
import selectedPane from './selectedPane.md';

class CogniteClient extends TimeseriesMockClient {
  timeseries: any = {
    ...MockTimeseriesClientObject,
    list: () => ({
      autoPagingToArray: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return timeseriesListV2;
      },
    }),
  };
  datapoint = {
    ...MockDatapointsClientObject,
    retrieveLatest: () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              isString: false,
              id: 123,
              datapoints: [
                {
                  timestamp: new Date(),
                  value: 15 + Math.random() * 5.0,
                },
              ],
            },
          ]);
        }, 1000);
      }),
  };
  assets: any = {
    retrieve: () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve([fakeAsset]);
        }, 1000);
      }),
  };
  events: any = {
    list: () => ({
      autoPagingToArray: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(fakeEvents);
          }, 1000);
        });
      },
    }),
  };
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

const onPaneChange = (key: string) => action('onPaneChange')(key);
const handleDocumentClick = (
  document: Document,
  category: string,
  description: string
) => {
  action('handleDocumentClick')(document, category, description);
};

storiesOf('AssetMeta', module)
  .addDecorator(clientSDKDecorator)
  .add(
    'Full Description',
    () => {
      return <AssetMeta assetId={4650652196144007} />;
    },
    {
      readme: {
        content: fullDescription,
      },
    }
  );

storiesOf('AssetMeta/Examples', module)
  .addDecorator(clientSDKDecorator)
  .add(
    'Basic',
    () => {
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
    'Custom details category',
    () => {
      return (
        <AssetMeta
          assetId={4650652196144007}
          detailsProps={{
            toCategory: name => name.split('_')[0],
            expandedCategories: ['SOURCE'],
          }}
        />
      );
    },
    {
      readme: {
        content: detailsCustomCategories,
      },
    }
  )
  .add(
    'Returns selected document',
    () => {
      return <AssetMeta assetId={123} docsProps={{ handleDocumentClick }} />;
    },
    {
      readme: {
        content: selectedDocument,
      },
    }
  )
  .add(
    'Custom document priority categories',
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
        content: docCustomPriorityCategory,
      },
    }
  )
  .add(
    'Custom document categories sort',
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
        content: docCustomCategorySort,
      },
    }
  )
  .add(
    'Custom document category priority and sort',
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
        content: docCustomPriorityAndSort,
      },
    }
  )
  .add(
    'Custom TimeseriesChartMeta',
    () => {
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
    'With custom spinner',
    () => {
      return (
        <AssetMeta assetId={123456} customSpinner={<div>Loading...</div>} />
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
      return <AssetMeta assetId={123456} styles={ASSET_META_STYLES} />;
    },
    {
      readme: {
        content: customStyles,
      },
    }
  );
