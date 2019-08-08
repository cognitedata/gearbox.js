import {
  GetTimeSeriesMetadataDTO,
  TimeseriesIdEither,
  TimeSeriesSearchDTO,
} from '@cognite/sdk/dist/src/types/types';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { timeseriesListV2 } from '../../../mocks';
import { assetsList } from '../../../mocks';

import { MockCogniteClient } from '../../../utils/mockSdk';
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
import withTheme from './withTheme.md';

const timeseriesNames = timeseriesListV2.map(ts => ts.name);
const timeseriesIds = timeseriesListV2.map(ts => ts.id);

class CogniteClient extends MockCogniteClient {
  timeseries: any = {
    retrieve: (
      ids: TimeseriesIdEither[]
    ): Promise<GetTimeSeriesMetadataDTO[]> => {
      const idsAsString = ids.map(x => x.toString());
      return new Promise(resolve => {
        setTimeout(() => {
          const result = timeseriesListV2.filter(
            (x: GetTimeSeriesMetadataDTO) =>
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
          const result = timeseriesListV2.filter(
            (x: GetTimeSeriesMetadataDTO) =>
              // @ts-ignore
              x.name.toUpperCase().indexOf(query.search.query.toUpperCase()) >=
              0
          );
          resolve(result || []);
        }, 1000);
      });
    },
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

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
    return (
      <ClientSDKProvider client={sdk}>
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
      return (
        <ClientSDKProvider client={sdk}>
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
      return (
        <ClientSDKProvider client={sdk}>
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
      return (
        <ClientSDKProvider client={sdk}>
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
      return (
        <ClientSDKProvider client={sdk}>
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
      return (
        <ClientSDKProvider client={sdk}>
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
      return (
        <ClientSDKProvider client={sdk}>
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
      return (
        <ClientSDKProvider client={sdk}>
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
    'With Theme',
    () => {
      const ExampleTheme = {
        gearbox: {
          selectColor: 'red',
          white: '#fff',
        },
      };
      return (
        <ThemeProvider theme={ExampleTheme}>
          <ClientSDKProvider client={sdk}>
            <TimeseriesSearch
              onTimeserieSelectionChange={onTimeserieSelectionChange}
            />
          </ClientSDKProvider>
        </ThemeProvider>
      );
    },
    {
      readme: {
        content: injectTimeseriesNames(withTheme.toString()),
      },
    }
  )
  .add(
    'Custom strings',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesSearch
            onTimeserieSelectionChange={onTimeserieSelectionChange}
            // rootAssetSelect={true}
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
