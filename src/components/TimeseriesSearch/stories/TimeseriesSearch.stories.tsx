import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { assetsList, timeseriesList } from '../../../mocks';
import { TimeseriesSearch } from '../TimeseriesSearch';

import * as allowStrings from './allowStrings.md';
import * as basic from './basic.md';
import * as customFilter from './customFilter.md';
import * as fullDescription from './full.md';
import * as hideSelectedRow from './hideSelectedRow.md';
import * as preselected from './preselected.md';
import * as singleSelection from './singleSelection.md';

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
  timeseries: sdk.Timeseries
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
      content: fullDescription,
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
  );
