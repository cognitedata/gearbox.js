/* eslint-disable react/no-multi-comp */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  datapointsList,
  datapoints,
  testData,
} from 'mocks/timeseriesDataPointsList';
import { timeseriesList } from 'mocks/timeseriesList';
import * as sdk from '@cognite/sdk';
import TimeseriesChart from 'components/TimeseriesChart/TimeseriesChart';
sdk.TimeSeries.list = async (
  input: sdk.TimeseriesSearchParams
): Promise<sdk.TimeseriesWithCursor> => {
  action('sdk.TimeSeries.list')(input);
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

const randomData = (start: number, end: number, n = 250): sdk.Datapoint[] => {
  const data = [];
  const dt = (end - start) / n;
  for (let i = start; i <= end; i += dt) {
    const values = [0, 0, 0]
      .map(
        () =>
          Math.sin(i / 20) * 50 +
          Math.cos(Math.PI - i / 40) * 50 +
          Math.random() * 10
      )
      .sort((a: number, b: number) => a - b);
    data.push({
      timestamp: i,
      average: values[1],
      min: values[0],
      max: values[2],
      count: 7000,
    });
  }
  return data;
};

sdk.Datapoints.retrieveByName = async (
  name: string,
  params?: sdk.DatapointsRetrieveParams | undefined
): Promise<sdk.DataDatapoints> => {
  action('sdk.Datapoints.retrieveByName')(name, params);
  return {
    name: 'VAL_45-FT-92139B:X.Value',
    // datapoints,
    datapoints: randomData(
      params ? params.start || 0 : 0,
      params ? params.end || 100 : 100
    ),
  };
};

// const ApiKey = 'ZTg3NzA4ZmMtNWExYS00OWMzLWExZmItZmRiNGFlOTc0MGM3';

// sdk.configure({
//   apiKey: ApiKey,
//   project: 'publicdata',
// });

storiesOf('TimeseriesChart', module)
  .addDecorator(story => <div style={{ width: '100%' }}>{story()}</div>)
  .add('Single', () => (
    <TimeseriesChart
      timeseriesNames={['abc']}
      start={+Date.now() - 30 * 24 * 60 * 60 * 1000}
      end={+Date.now()}
    />
  ))
  .add('Multiple', () => (
    <TimeseriesChart
      timeseriesNames={['abc', '123']}
      start={+Date.now() - 30 * 24 * 60 * 60 * 1000}
      end={+Date.now()}
    />
  ))
  .add('Context chart', () => (
    <TimeseriesChart
      timeseriesNames={['abc']}
      start={+Date.now() - 30 * 24 * 60 * 60 * 1000}
      end={+Date.now()}
      contextChart={true}
    />
  ))
  .add('Live update', () => (
    <TimeseriesChart
      timeseriesNames={['abc']}
      start={+Date.now() - 30 * 24 * 60 * 60 * 1000}
      end={+Date.now()}
      liveUpdate={true}
      updateIntervalMillis={2000}
    />
  ))
  .add('Zoomable', () => (
    <TimeseriesChart
      timeseriesNames={['abc']}
      start={+Date.now() - 30 * 24 * 60 * 60 * 1000}
      end={+Date.now()}
      zoomable={true}
      contextChart={true}
    />
  ));
