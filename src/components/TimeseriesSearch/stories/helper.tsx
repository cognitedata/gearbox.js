// Copyright 2020 Cognite AS
import {
  Asset,
  AssetListScope,
  Timeseries,
  TimeseriesIdEither,
  TimeseriesSearchFilter,
} from '@cognite/sdk';
import { pick } from 'lodash';
import React from 'react';
import {
  assetsList,
  MockCogniteClient,
  sleep,
  timeseriesListV2,
} from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';

class CogniteClient extends MockCogniteClient {
  timeseries: any = {
    retrieve: async (ids: TimeseriesIdEither[]): Promise<Timeseries[]> => {
      const idsAsString = ids.map(x => x.toString());
      await sleep(1000);
      const result = timeseriesListV2.filter((x: Timeseries) =>
        idsAsString.includes(x.id.toString())
      );
      return result || [];
    },
    search: async (query: TimeseriesSearchFilter): Promise<Timeseries[]> => {
      console.log('client.search', query);
      await sleep(1000);
      const result = timeseriesListV2.filter(
        (x: Timeseries) =>
          // @ts-ignore
          x.name.toUpperCase().indexOf(query.search.query.toUpperCase()) >= 0
      );
      return result || [];
    },
  };
  assets: any = {
    // @ts-ignore
    list: (scope: AssetListScope) => {
      // @ts-ignore
      const items: Asset[] = assetsList.map(asset =>
        pick(asset, [
          'id',
          'name',
          'description',
          'lastUpdatedTime',
          'createdTime',
        ])
      );
      return { items };
    },
  };
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const onTimeserieSelectionChange = (
  newTimeseriesIds: number[],
  selectedTimeseries: Timeseries
) =>
  console.log(
    'newTimeseriesIds, selectedTimeseries',
    newTimeseriesIds,
    selectedTimeseries
  );

export const names = timeseriesListV2.map(ts => ts.name).join(', ');

export const filterRule = (timeseries: Timeseries): boolean =>
  !timeseries.isString;

export const customString = {
  rootAssetSelectAll: 'No filter',
  searchPlaceholder: 'search for stuff!',
  selectAll: 'Everything!',
  selectNone: 'Nothing!',
};

export const customStyles = {
  list: { height: '200px' },
  buttonRow: { marginTop: '30px' },
  selectAllButton: { backgroundColor: 'lightblue' },
  selectNoneButton: {
    backgroundColor: 'magenta',
    marginLeft: '50px',
  },
};

export const ExampleTheme = {
  gearbox: {
    selectColor: 'red',
    white: '#fff',
  },
};
