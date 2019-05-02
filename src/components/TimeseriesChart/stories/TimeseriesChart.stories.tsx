/* eslint-disable react/no-multi-comp */
import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { TimeseriesChart } from '../TimeseriesChart';

import * as collapsedYAxis from './collapsedYAxis.md';
import * as contextChart from './contextChart.md';
import * as empty from './empty.md';
import * as full from './full.md';
import * as leftYAxis from './leftYAxis.md';
import * as liveUpdate from './liveUpdate.md';
import * as multiple from './multiple.md';
import * as noYAxis from './noYAxis.md';
import * as single from './single.md';
import * as startEnd from './startEnd.md';
import * as zoomable from './zoomable.md';

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

storiesOf('TimeseriesChart', module).add(
  'Full description',
  () => {
    setupMocks();
    return <TimeseriesChart timeseriesIds={[123]} />;
  },
  {
    readme: {
      content: full,
    },
    info: {
      header: false,
      source: false,
      styles: {
        infoBody: { display: 'none' },
      },
    },
  }
);

storiesOf('TimeseriesChart/Examples', module)
  .addDecorator(story => <div style={{ width: '100%' }}>{story()}</div>)
  .addParameters({
    info: {
      header: false,
      source: false,
      styles: {
        infoBody: { display: 'none' },
      },
    },
  })
  .add(
    'Empty',
    () => {
      setupMocks();
      return <TimeseriesChart timeseriesIds={[]} />;
    },
    {
      readme: {
        content: empty,
      },
    }
  )
  .add(
    'Single',
    () => {
      setupMocks();
      return <TimeseriesChart timeseriesIds={[123]} />;
    },
    {
      readme: {
        content: single,
      },
    }
  )
  .add(
    'Multiple',
    () => {
      setupMocks();
      return <TimeseriesChart timeseriesIds={[123, 456]} />;
    },
    {
      readme: {
        content: multiple,
      },
    }
  )
  .add(
    'Left y-axis',
    () => {
      setupMocks();
      return <TimeseriesChart timeseriesIds={[123]} yAxisPlacement={'LEFT'} />;
    },
    {
      readme: {
        content: leftYAxis,
      },
    }
  )
  .add(
    'No y-axis',
    () => {
      setupMocks();
      return (
        <TimeseriesChart timeseriesIds={[123]} yAxisDisplayMode={'NONE'} />
      );
    },
    {
      readme: {
        content: noYAxis,
      },
    }
  )
  .add(
    'Collapsed y-axis',
    // tslint:disable-next-line: no-identical-functions
    () => {
      setupMocks();
      return (
        <TimeseriesChart timeseriesIds={[123]} yAxisDisplayMode={'COLLAPSED'} />
      );
    },
    {
      readme: {
        content: collapsedYAxis,
      },
    }
  )
  .add(
    'Start and end',
    () => {
      setupMocks();
      return (
        <TimeseriesChart
          timeseriesIds={[123]}
          start={new Date(2019, 3, 1)}
          end={new Date(2019, 4, 1)}
        />
      );
    },
    {
      readme: {
        content: startEnd,
      },
    }
  )
  .add(
    'Context chart',
    () => {
      setupMocks();
      return <TimeseriesChart timeseriesIds={[123]} contextChart={true} />;
    },
    {
      readme: {
        content: contextChart,
      },
    }
  )
  .add(
    'Zoomable',
    () => {
      setupZoomableMocks();
      return (
        <TimeseriesChart
          timeseriesIds={[123]}
          start={+Date.now() - 30 * 24 * 60 * 60 * 1000}
          end={Date.now()}
          zoomable={true}
          contextChart={true}
        />
      );
    },
    {
      readme: {
        content: zoomable,
      },
    }
  )
  .add(
    'Live update',
    () => {
      setupMocks(1);
      return (
        <TimeseriesChart
          timeseriesIds={[123]}
          start={+Date.now() - 60 * 1000}
          end={Date.now()}
          liveUpdate={true}
          updateIntervalMillis={2000}
        />
      );
    },
    {
      readme: {
        content: liveUpdate,
      },
    }
  );
