/* eslint-disable react/no-multi-comp */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import * as sdk from '@cognite/sdk';
import TimeseriesChart from './TimeseriesChart';

const randomData = (start: number, end: number, n: number): sdk.Datapoint[] => {
  const data = [];
  const dt = (end - start) / n;
  for (let i = start; i <= end; i += dt) {
    const values = [0, 0, 0]
      .map(
        () =>
          Math.sin(i / 20) * 50 +
          Math.cos(Math.PI - i / 40) * 50 +
          Math.random() * 40
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

const setupMocks = (n = 100) => {
  sdk.TimeSeries.retrieve = async (id: number, _): Promise<sdk.Timeseries> => {
    action('sdk.TimeSeries.retrieve')(id);
    return { id, name: 'name' };
  };

  sdk.Datapoints.retrieve = async (
    id: number,
    params?: sdk.DatapointsRetrieveParams | undefined
  ): Promise<sdk.DataDatapoints> => {
    action('sdk.Datapoints.retrieve')(id, params);
    return {
      name: 'name',
      datapoints: randomData(
        params ? params.start || 0 : 0,
        params ? params.end || 100 : 100,
        n
      ),
    };
  };
};

const setupZoomableMocks = () => {
  sdk.TimeSeries.retrieve = async (id: number, _): Promise<sdk.Timeseries> => {
    action('sdk.TimeSeries.retrieve')(id);
    return { id, name: 'name' };
  };

  sdk.Datapoints.retrieve = async (
    id: number,
    params?: sdk.DatapointsRetrieveParams | undefined
  ): Promise<sdk.DataDatapoints> => {
    action('sdk.Datapoints.retrieve')(id, params);
    if (params === undefined) {
      return {
        name: 'name',
        datapoints: randomData(0, 100, 250),
      };
    }
    const granularity = params.granularity || '10s';
    const n = granularity === 's' ? 2 : granularity.includes('s') ? 10 : 250;
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

storiesOf('TimeseriesChart', module)
  .addDecorator(story => <div style={{ width: '100%' }}>{story()}</div>)
  .add('Empty', () => {
    setupMocks();
    return <TimeseriesChart timeseriesIds={[]} />;
  })
  .add('Single', () => {
    setupMocks();
    return <TimeseriesChart timeseriesIds={[123]} />;
  })
  .add('Multiple', () => {
    setupMocks();
    return <TimeseriesChart timeseriesIds={[123, 456]} />;
  })
  .add('Left y-axis', () => {
    setupMocks();
    return (
      <TimeseriesChart timeseriesIds={[123, 456]} yAxisPlacement={'LEFT'} />
    );
  })
  .add('No y-axis', () => {
    setupMocks();
    return (
      <TimeseriesChart timeseriesIds={[123, 456]} yAxisDisplayMode={'NONE'} />
    );
  })
  // tslint:disable-next-line: no-identical-functions
  .add('Collapsed y-axis', () => {
    setupMocks();
    return (
      <TimeseriesChart
        timeseriesIds={[123, 456]}
        yAxisDisplayMode={'COLLAPSED'}
      />
    );
  })
  .add('Context chart', () => {
    setupMocks();
    return <TimeseriesChart timeseriesIds={[123]} contextChart={true} />;
  })
  .add('Zoomable', () => {
    setupZoomableMocks();
    return (
      <TimeseriesChart
        timeseriesIds={[123]}
        start={+Date.now() - 30 * 24 * 60 * 60 * 1000}
        end={+Date.now()}
        zoomable={true}
        contextChart={true}
      />
    );
  })
  .add('Live update', () => {
    setupMocks(1);
    return (
      <TimeseriesChart
        timeseriesIds={[123]}
        start={+Date.now() - 60 * 1000}
        end={+Date.now()}
        liveUpdate={true}
        updateIntervalMillis={2000}
      />
    );
  });
