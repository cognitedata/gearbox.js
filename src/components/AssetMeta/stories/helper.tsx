import React from 'react';
import {
  DOCUMENTS,
  fakeAsset,
  fakeEvents,
  randomLatestDatapoint,
  timeseriesListV2,
} from '../../../mocks';
import { sleep } from '../../../mocks';
import {
  MockDatapointsRetrieve,
  MockTimeseriesClientObject,
  TimeseriesMockClient,
} from '../../../mocks/datapoints';
import { ClientSDKProvider } from '../../ClientSDKProvider';

class CogniteClient extends TimeseriesMockClient {
  timeseries: any = {
    ...MockTimeseriesClientObject,
    list: () => ({
      autoPagingToArray: async () => {
        await sleep(1000);
        return timeseriesListV2;
      },
    }),
  };
  datapoints = {
    retrieve: MockDatapointsRetrieve,
    retrieveLatest: async () => randomLatestDatapoint(),
  };
  assets: any = {
    retrieve: async () => {
      await sleep(1000);
      return [fakeAsset];
    },
  };
  events: any = {
    list: () => ({
      autoPagingToArray: async () => {
        await sleep(1000);
        return fakeEvents;
      },
    }),
  };
  files: any = {
    list: () => ({
      autoPagingToArray: async () => {
        await sleep(1000);
        return DOCUMENTS;
      },
    }),
  };
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const onPaneChange = (key: string) => console.log('onPaneChange', key);

export const detailsProps = {
  toCategory: (name: string) => name.split('_')[0],
  expandedCategories: ['SOURCE'],
};

export const handleDocumentClick = (
  document: Document,
  category: string,
  description: string
) => {
  console.log('handleDocumentClick', document, category, description);
};

export const priorityCategoriesDocsProps = {
  categoryPriorityList: ['AB', 'ZE'],
};

export const categoriesSortDocsProps = {
  customCategorySort: (a: string, b: string) => (a > b ? -1 : a < b ? 1 : 0),
  categoryPriorityList: [],
};

export const priorityAndSortDocsProps = {
  customCategorySort: (a: string, b: string) => (a > b ? -1 : a < b ? 1 : 0),
  categoryPriorityList: ['ZE'],
};

export const timeseriesProps = {
  defaultTimePeriod: 'lastYear',
  showMetadata: false,
  showDatapoint: false,
  showDescription: false,
  liveUpdate: false,
};
