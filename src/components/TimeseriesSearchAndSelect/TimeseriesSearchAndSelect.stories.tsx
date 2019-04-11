import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import * as sdk from '@cognite/sdk';
import TimeserieSearchAndSelect from 'components/TimeseriesSearchAndSelect/TimeseriesSearchAndSelect';
import { assetsList } from 'mocks/assetsList';
import { timeseriesList } from 'mocks/timeseriesList';
import { VAsset } from 'utils/validators';

const timeseriesNames = timeseriesList.map(ts => ts.name);
const infoText = `Names you can search for : ${timeseriesNames.join(', ')}.`;

// Mock the SDK calls
sdk.Assets.list = async (
  input: sdk.AssetListParams
): Promise<sdk.AssetDataWithCursor> => {
  action('sdk.Assets.list')(input);
  return {
    items: assetsList.map(
      (a: VAsset): sdk.Asset => {
        return {
          id: Number.parseInt(a.id.toString(), 10),
          name: a.name,
          description: a.description,
        };
      }
    ),
  };
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
      ts => ts.name.toUpperCase().indexOf(input.query.toUpperCase()) >= 0
    ),
  };
};

const filterRule = (timeseries: sdk.Timeseries): boolean =>
  !timeseries.isString;

const onTimeserieSelectionChange = (
  newTimeseries: string[],
  timeseries: sdk.Timeseries
) => {
  action('onTimeserieSelectionChange')(newTimeseries, timeseries);
};

storiesOf('TimeserieSearchAndSelect', module)
  .add(
    'Basic',
    () => (
      <TimeserieSearchAndSelect
        onTimeserieSelectionChange={onTimeserieSelectionChange}
      />
    ),
    {
      info: {
        text: infoText,
      },
    }
  )
  .add(
    'Single selection',
    () => (
      <TimeserieSearchAndSelect
        onTimeserieSelectionChange={onTimeserieSelectionChange}
        single={true}
      />
    ),
    {
      info: {
        text: infoText,
      },
    }
  )
  .add(
    'Allow strings',
    () => (
      <TimeserieSearchAndSelect
        onTimeserieSelectionChange={onTimeserieSelectionChange}
        allowStrings={true}
      />
    ),
    {
      info: {
        text: infoText,
      },
    }
  )
  .add(
    'Preselected',
    () => (
      <TimeserieSearchAndSelect
        onTimeserieSelectionChange={onTimeserieSelectionChange}
        selectedTimeseries={[timeseriesNames[1], timeseriesNames[3]]}
      />
    ),
    {
      info: {
        text: infoText,
      },
    }
  )
  .add(
    'Custom filter rule',
    () => (
      <TimeserieSearchAndSelect
        onTimeserieSelectionChange={onTimeserieSelectionChange}
        filterRule={filterRule}
      />
    ),
    {
      info: {
        text: `const filterRule = (timeseries: sdk.Timeseries) : boolean =>
      !timeseries.isString;`,
      },
    }
  );
