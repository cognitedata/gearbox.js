import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TimeserieSearchAndSelect from 'components/TimeseriesSearchAndSelect/TimeseriesSearchAndSelect';
import { assetsList } from 'mocks/assetsList';
import {
  VApiQuery,
  VId,
  VOnTimeserieSelectionChangeResult,
  VTimeseries,
} from 'utils/validators';
import { timeseriesList } from 'mocks/timeseriesList';

const timeseriesNames = timeseriesList.map(ts => ts.name).join(', ');
const infoText = `Names you can search for : ${timeseriesNames}.`;

const onSearch = async (apiQuery: VApiQuery) => {
  action('onSearch')(apiQuery);
  if (!apiQuery.query) {
    return {
      items: timeseriesList,
    };
  }
  return {
    items: timeseriesList.filter(
      ts => ts.name.toUpperCase().indexOf(apiQuery.query.toUpperCase()) >= 0
    ),
  };
};

const filterRule = (timeseries: VTimeseriess): boolean => !timeseries.isString;

const onTimeserieSelectionChange = (
  selectionResult: VOnTimeserieSelectionChangeResult
) => {
  action('onTimeserieSelectionChange')(selectionResult);
};

storiesOf('TimeserieSearchAndSelect', module)
  .add(
    'Basic',
    () => (
      <TimeserieSearchAndSelect
        onSearch={onSearch}
        assets={assetsList}
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
    'Allow strings',
    () => (
      <TimeserieSearchAndSelect
        onSearch={onSearch}
        assets={assetsList}
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
    'Custom filter rule',
    () => (
      <TimeserieSearchAndSelect
        onSearch={onSearch}
        assets={assetsList}
        onTimeserieSelectionChange={onTimeserieSelectionChange}
        filterRule={filterRule}
      />
    ),
    {
      info: {
        text: `const filterRule = (timeseries: VTimeseriess) : boolean =>
      !timeseries.isString;`,
      },
    }
  );
