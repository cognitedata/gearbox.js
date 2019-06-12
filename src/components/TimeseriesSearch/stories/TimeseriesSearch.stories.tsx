import * as sdk from '@cognite/sdk';
import * as sdk2 from '@cognite/sdk-alpha';
import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import {
  GetTimeSeriesMetadataDTO,
  TimeseriesIdEither,
  TimeSeriesSearchDTO,
} from '@cognite/sdk-alpha/dist/src/types/types';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { assetsList, timeseriesList } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { TimeseriesSearch } from '../TimeseriesSearch';

import allowStrings from './allowStrings.md';
import basic from './basic.md';
import customFilter from './customFilter.md';
import customStrings from './customStrings.md';
import customStyles from './customStyles.md';
import fullDescription from './full.md';
import hideSelectedRow from './hideSelectedRow.md';
import preselected from './preselected.md';
// @ts-ignore
import rootAssetSelect from './rootAssetSelect.md';
import singleSelection from './singleSelection.md';

const timeseriesNames = timeseriesList.map(ts => ts.name);
const timeseriesIds = timeseriesList.map(ts => ts.id);

const fakeClient: API = {
  timeseries: {
    retrieve: (
      ids: TimeseriesIdEither[]
    ): Promise<GetTimeSeriesMetadataDTO[]> => {
      const idsAsString = ids.map(x => x.id.toString());
      return new Promise(resolve => {
        setTimeout(() => {
          console.log(timeseriesList);
          const result = timeseriesList.filter((x: GetTimeSeriesMetadataDTO) =>
            idsAsString.includes(x.id.toString())
          );
          resolve(result || []);
        }, 1000); // simulate load delay
      });
    },
    search: (
      query: TimeSeriesSearchDTO
    ): Promise<GetTimeSeriesMetadataDTO[]> => {
      action('client.search')(query);
      return new Promise(resolve => {
        setTimeout(() => {
          const result = timeseriesList.filter(
            (x: GetTimeSeriesMetadataDTO) =>
              x.name.toUpperCase().indexOf(query.search.query.toUpperCase()) >=
              0
          );
          resolve(result || []);
        }, 1000);
      });
    },
  },
};

// Mock the SDK calls
const setupMocks = () => {
  sdk.Assets.list = async (
    input: sdk.AssetListParams
  ): Promise<sdk.AssetDataWithCursor> => {
    action('sdk.Assets.list')(input);
    return {
      items: assetsList.map(
        (a: sdk.Asset): sdk.Asset => {
          return {
            id: a.id,
            name: a.name,
            description: a.description,
          };
        }
      ),
    };
  };

  sdk.TimeSeries.retrieveMultiple = async (
    ids: number[]
  ): Promise<sdk.Timeseries[]> => {
    return timeseriesList.filter(timeseries => ids.includes(timeseries.id));
  };

  sdk.TimeSeries.search = async (
    input: sdk.TimeseriesSearchParams
  ): Promise<sdk.TimeseriesWithCursor> => {
    action('sdk.TimeSeries.search')(input);
    if (!input.query) {
      return {
        items: timeseriesList,
      };
    }
    return {
      items: timeseriesList.filter(
        // @ts-ignore
        ts => ts.name.toUpperCase().indexOf(input.query.toUpperCase()) >= 0
      ),
    };
  };
};

const injectTimeseriesNames = (content: string) => {
  return content.replace('${names}', timeseriesNames.join(', '));
};

const filterRule = (timeseries: GetTimeSeriesMetadataDTO): boolean =>
  !timeseries.isString;

const onTimeserieSelectionChange = (
  newTimeseries: number[],
  timeseries: GetTimeSeriesMetadataDTO | null
) => {
  action('onTimeserieSelectionChange')(newTimeseries, timeseries);
};

storiesOf('TimeseriesSearch', module).add(
  'Full Description',
  () => {
    setupMocks();

    return (
      <ClientSDKProvider client={fakeClient}>
        <TimeseriesSearch
          onTimeserieSelectionChange={onTimeserieSelectionChange}
        />
      </ClientSDKProvider>
    );
  },
  {
    readme: {
      content: injectTimeseriesNames(fullDescription.toString()),
    },
  }
);

storiesOf('TimeseriesSearch/Examples', module)
  .add(
    'Basic',
    // tslint:disable-next-line: no-identical-functions
    () => {
      setupMocks();
      return (
        <ClientSDKProvider client={fakeClient}>
          <TimeseriesSearch
            onTimeserieSelectionChange={onTimeserieSelectionChange}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: injectTimeseriesNames(basic.toString()),
      },
    }
  )
  // assetSubtree query is not supported yet. Check with f1
  // .add(
  //   'Show root asset select',
  //   () => {
  //     setupMocks();
  //     return (
  //       <ClientSDKProvider client={fakeClient}>
  //         <TimeseriesSearch
  //           onTimeserieSelectionChange={onTimeserieSelectionChange}
  //           rootAssetSelect={true}
  //         />
  //       </ClientSDKProvider>
  //     );
  //   },
  //   {
  //     readme: {
  //       content: injectTimeseriesNames(rootAssetSelect.toString()),
  //     },
  //   }
  // )
  .add(
    'Hide selected row',
    () => {
      setupMocks();
      return (
        <ClientSDKProvider client={fakeClient}>
          <TimeseriesSearch
            onTimeserieSelectionChange={onTimeserieSelectionChange}
            hideSelected={true}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: injectTimeseriesNames(hideSelectedRow.toString()),
      },
    }
  )
  .add(
    'Single selection',
    () => {
      setupMocks();
      return (
        <ClientSDKProvider client={fakeClient}>
          <TimeseriesSearch
            onTimeserieSelectionChange={onTimeserieSelectionChange}
            single={true}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: injectTimeseriesNames(singleSelection.toString()),
      },
    }
  )
  .add(
    'Allow strings',
    () => {
      setupMocks();
      return (
        <ClientSDKProvider client={fakeClient}>
          <TimeseriesSearch
            onTimeserieSelectionChange={onTimeserieSelectionChange}
            allowStrings={true}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: injectTimeseriesNames(allowStrings.toString()),
      },
    }
  )
  .add(
    'Preselected',
    () => {
      setupMocks();
      return (
        <ClientSDKProvider client={fakeClient}>
          <TimeseriesSearch
            onTimeserieSelectionChange={onTimeserieSelectionChange}
            selectedTimeseries={[timeseriesIds[1], timeseriesIds[3]]}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: injectTimeseriesNames(preselected.toString()),
      },
    }
  )
  .add(
    'Custom filter rule',
    () => {
      setupMocks();
      return (
        <ClientSDKProvider client={fakeClient}>
          <TimeseriesSearch
            onTimeserieSelectionChange={onTimeserieSelectionChange}
            filterRule={filterRule}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: injectTimeseriesNames(customFilter.toString()),
      },
    }
  )
  .add(
    'Custom styles',
    () => {
      setupMocks();
      return (
        <ClientSDKProvider client={fakeClient}>
          <TimeseriesSearch
            onTimeserieSelectionChange={onTimeserieSelectionChange}
            styles={{
              list: { height: '200px' },
              buttonRow: { marginTop: '30px' },
              selectAllButton: { backgroundColor: 'lightblue' },
              selectNoneButton: {
                backgroundColor: 'magenta',
                marginLeft: '50px',
              },
            }}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: injectTimeseriesNames(customStyles.toString()),
      },
    }
  )
  .add(
    'Custom strings',
    () => {
      setupMocks();
      return (
        <ClientSDKProvider client={fakeClient}>
          <TimeseriesSearch
            onTimeserieSelectionChange={onTimeserieSelectionChange}
            rootAssetSelect={true}
            strings={{
              rootAssetSelectAll: 'No filter',
              searchPlaceholder: 'search for stuff!',
              selectAll: 'Everything!',
              selectNone: 'Nothing!',
            }}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: injectTimeseriesNames(customStrings.toString()),
      },
    }
  );
