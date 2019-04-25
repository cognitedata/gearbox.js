import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { assetsList, timeseriesList } from '../../mocks';
import { TimeseriesSearch } from './TimeseriesSearch';

const timeseriesNames = timeseriesList.map(ts => ts.name);
const timeseriesIds = timeseriesList.map(ts => ts.id);
const infoText = `Names you can search for : ${timeseriesNames.join(', ')}.`;

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

const filterRule = (timeseries: sdk.Timeseries): boolean =>
  !timeseries.isString;

const onTimeserieSelectionChange = (
  newTimeseries: number[],
  timeseries: sdk.Timeseries
) => {
  action('onTimeserieSelectionChange')(newTimeseries, timeseries);
};

storiesOf('TimeseriesSearch', module)
  .add(
    'Basic',
    () => {
      setupMocks();
      return (
        <TimeseriesSearch
          onTimeserieSelectionChange={onTimeserieSelectionChange}
        />
      );
    },
    {
      info: {
        text: infoText,
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
      info: {
        text: infoText,
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
      info: {
        text: infoText,
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
      info: {
        text: infoText,
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
      info: {
        text: infoText,
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
      info: {
        text: `const filterRule = (timeseries: sdk.Timeseries) : boolean =>
      !timeseries.isString;`,
      },
    }
  );
