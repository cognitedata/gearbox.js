import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { assetsList, timeseriesList } from '../../../mocks';
import { TimeseriesSearch } from '../TimeseriesSearch';

import allowStrings from './allowStrings.md';
import basic from './basic.md';
import customFilter from './customFilter.md';
import customStrings from './customStrings.md';
import customStyles from './customStyles.md';
import fullDescription from './full.md';
import hideSelectedRow from './hideSelectedRow.md';
import preselected from './preselected.md';
import rootAssetSelect from './rootAssetSelect.md';
import singleSelection from './singleSelection.md';
import withTheme from './withTheme.md';

const timeseriesNames = timeseriesList.map(ts => ts.name);
const timeseriesIds = timeseriesList.map(ts => ts.id);

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

const filterRule = (timeseries: sdk.Timeseries): boolean =>
  !timeseries.isString;

const onTimeserieSelectionChange = (
  newTimeseries: number[],
  timeseries: sdk.Timeseries | null
) => {
  action('onTimeserieSelectionChange')(newTimeseries, timeseries);
};

storiesOf('TimeseriesSearch', module).add(
  'Full Description',
  () => {
    setupMocks();

    return (
      <TimeseriesSearch
        onTimeserieSelectionChange={onTimeserieSelectionChange}
      />
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
        <TimeseriesSearch
          onTimeserieSelectionChange={onTimeserieSelectionChange}
        />
      );
    },
    {
      readme: {
        content: injectTimeseriesNames(basic.toString()),
      },
    }
  )
  .add(
    'Show root asset select',
    () => {
      setupMocks();
      return (
        <TimeseriesSearch
          onTimeserieSelectionChange={onTimeserieSelectionChange}
          rootAssetSelect={true}
        />
      );
    },
    {
      readme: {
        content: injectTimeseriesNames(rootAssetSelect.toString()),
      },
    }
  )
  .add(
    'Hide selected row',
    () => {
      setupMocks();
      return (
        <TimeseriesSearch
          onTimeserieSelectionChange={onTimeserieSelectionChange}
          hideSelected={true}
        />
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
        <TimeseriesSearch
          onTimeserieSelectionChange={onTimeserieSelectionChange}
          single={true}
        />
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
        <TimeseriesSearch
          onTimeserieSelectionChange={onTimeserieSelectionChange}
          allowStrings={true}
        />
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
        <TimeseriesSearch
          onTimeserieSelectionChange={onTimeserieSelectionChange}
          selectedTimeseries={[timeseriesIds[1], timeseriesIds[3]]}
        />
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
        <TimeseriesSearch
          onTimeserieSelectionChange={onTimeserieSelectionChange}
          filterRule={filterRule}
        />
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
      setupMocks();
      const ExampleTheme = {
        gearbox: {
          selectColor: 'red',
          white: '#fff',
        },
      };
      return (
        <ThemeProvider theme={ExampleTheme}>
          <TimeseriesSearch
            onTimeserieSelectionChange={onTimeserieSelectionChange}
          />
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
      setupMocks();
      return (
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
      );
    },
    {
      readme: {
        content: injectTimeseriesNames(customStrings.toString()),
      },
    }
  );
