/* eslint-disable react/no-multi-comp */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import {
//   datapointsList,
//   datapoints,
//   testData,
// } from 'mocks/timeseriesDataPointsList';
import { timeseriesList } from '../../mocks/timeseriesList';
import * as sdk from '@cognite/sdk';
import TimeseriesChart from './TimeseriesChart';

const randomData = (start: number, end: number, n = 250): sdk.Datapoint[] => {
  const data = [];
  const dt = (end - start) / n;
  for (let i = start; i <= end; i += dt) {
    const values = [0, 0, 0]
      .map(
        () =>
          Math.sin(i / 20) * 50 +
          Math.cos(Math.PI - i / 40) * 50 +
          Math.random() * 100
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

const setupMocks = () => {
  sdk.TimeSeries.retrieve = async (id: number, _): Promise<sdk.Timeseries> => {
    action('sdk.TimeSeries.retrieve')(id);
    const timeserie = timeseriesList.find(ts => ts.id === id);
    if (!timeserie) {
      throw new Error('Cannot find mocked timeseries');
    }
    return timeserie;
  };

  sdk.Datapoints.retrieve = async (
    id: number,
    params?: sdk.DatapointsRetrieveParams | undefined
  ): Promise<sdk.DataDatapoints> => {
    action('sdk.Datapoints.retrieve')(id, params);
    const n =
      params.granularity === 's'
        ? 2
        : params.granularity.includes('s')
        ? 10
        : 250;
    return {
      name: 'name',
      // datapoints,
      datapoints: randomData(
        params ? params.start || 0 : 0,
        params ? params.end || 100 : 100,
        n
      ),
    };
  };
};

// const ApiKey = 'ZTg3NzA4ZmMtNWExYS00OWMzLWExZmItZmRiNGFlOTc0MGM3';

// sdk.configure({
//   apiKey: ApiKey,
//   project: 'publicdata',
// });

storiesOf('TimeseriesChart', module)
  .addDecorator(story => <div style={{ width: '100%' }}>{story()}</div>)
  .add('Single', () => {
    setupMocks();
    return (
      <TimeseriesChart
        timeseriesIds={[timeseriesList[0].id]}
        start={+Date.now() - 30 * 24 * 60 * 60 * 1000}
        end={+Date.now()}
      />
    );
  })
  .add('Multiple', () => {
    setupMocks();
    return (
      <TimeseriesChart
        timeseriesIds={[timeseriesList[0].id, timeseriesList[1].id]}
        start={+Date.now() - 30 * 24 * 60 * 60 * 1000}
        end={+Date.now()}
      />
    );
  })
  .add('Context chart', () => {
    setupMocks();
    return (
      <TimeseriesChart
        timeseriesIds={[timeseriesList[0].id]}
        start={+Date.now() - 30 * 24 * 60 * 60 * 1000}
        end={+Date.now()}
        contextChart={true}
      />
    );
  })
  .add('Live update', () => {
    setupMocks();
    return (
      <TimeseriesChart
        timeseriesIds={[timeseriesList[0].id]}
        start={+Date.now() - 30 * 24 * 60 * 60 * 1000}
        end={+Date.now()}
        liveUpdate={true}
        updateIntervalMillis={2000}
      />
    );
  })
  .add('Zoomable', () => {
    setupMocks();
    return (
      <TimeseriesChart
        timeseriesIds={[timeseriesList[0].id]}
        start={+Date.now() - 30 * 24 * 60 * 60 * 1000}
        end={+Date.now()}
        zoomable={true}
        contextChart={true}
      />
    );
  });
