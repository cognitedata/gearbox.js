/* eslint-disable react/no-multi-comp */
import { AxisDisplayMode } from '@cognite/griff-react';
import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { y0Accessor, y1Accessor, yAccessor } from '../dataLoader';
import { TimeseriesChart } from '../TimeseriesChart';

import annotations from './annotations.md';
import collapsedYAxis from './collapsedYAxis.md';
import containerStyle from './containerStyle.md';
import contextChart from './contextChart.md';
import crosshair from './crosshair.md';
import customColors from './customColors.md';
import customSeries from './customSeries.md';
import empty from './empty.md';
import full from './full.md';
import heightAndWidth from './heightAndWidth.md';
import hidden from './hidden.md';
import leftYAxis from './leftYAxis.md';
import liveUpdate from './liveUpdate.md';
import mouseEvents from './mouseEvents.md';
import multiple from './multiple.md';
import noXAxis from './noXAxis.md';
import noYAxis from './noYAxis.md';
import ruler from './ruler.md';
import single from './single.md';
import startEnd from './startEnd.md';
import xAxisHeight from './xAxisHeight.md';
import zoomable from './zoomable.md';

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

export const setupMocks = (n = 100) => {
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
  }
);

storiesOf('TimeseriesChart/Examples', module)
  .addDecorator(story => <div style={{ width: '100%' }}>{story()}</div>)
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
    'Hidden',
    () => {
      setupMocks();
      return (
        <TimeseriesChart
          timeseriesIds={[123, 456]}
          hiddenSeries={{ 123: true }}
        />
      );
    },
    {
      readme: {
        content: hidden,
      },
    }
  )
  .add(
    'Height and width',
    () => {
      setupMocks();
      return <TimeseriesChart timeseriesIds={[123]} height={300} width={800} />;
    },
    {
      readme: {
        content: heightAndWidth,
      },
    }
  )
  .add(
    'Custom container styles',
    () => {
      setupMocks();
      return (
        <TimeseriesChart
          timeseriesIds={[123]}
          styles={{
            container: { height: '300px', backgroundColor: 'lightblue' },
          }}
        />
      );
    },
    {
      readme: {
        content: containerStyle,
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
    'X-axis height',
    () => {
      setupMocks();
      return <TimeseriesChart timeseriesIds={[123]} xAxisHeight={100} />;
    },
    {
      readme: {
        content: xAxisHeight,
      },
    }
  )
  .add(
    'No x-axis',
    () => {
      setupMocks();
      return <TimeseriesChart timeseriesIds={[123]} xAxisHeight={0} />;
    },
    {
      readme: {
        content: noXAxis,
      },
    }
  )
  .add(
    'Start and end time',
    () => {
      setupMocks();
      return (
        <TimeseriesChart
          timeseriesIds={[123]}
          startTime={new Date(2019, 3, 1)}
          endTime={new Date(2019, 4, 1)}
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
    'Crosshair',
    () => {
      setupMocks();
      return <TimeseriesChart timeseriesIds={[123]} crosshair={true} />;
    },
    {
      readme: {
        content: crosshair,
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
          startTime={Date.now() - 30 * 24 * 60 * 60 * 1000}
          endTime={Date.now()}
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
          startTime={Date.now() - 60 * 1000}
          endTime={Date.now()}
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
  )
  .add(
    'Custom colors',
    () => {
      setupMocks();
      return (
        <TimeseriesChart
          timeseriesIds={[123, 456]}
          timeseriesColors={{ 123: 'red', 456: '#00ff00' }}
        />
      );
    },
    {
      readme: {
        content: customColors,
      },
    }
  )
  .add(
    'Annotations',
    () => {
      setupMocks();
      return (
        <TimeseriesChart
          timeseriesIds={[123]}
          startTime={Date.now() - 60 * 1000}
          endTime={Date.now()}
          // @ts-ignore
          annotations={[
            {
              data: [Date.now() - 30 * 1000, Date.now() - 20 * 1000],
              height: 30,
              id: 888,
            },
          ]}
        />
      );
    },
    {
      readme: {
        content: annotations,
      },
    }
  )
  .add(
    'Ruler',
    () => {
      setupMocks();
      return (
        <TimeseriesChart
          timeseriesIds={[123]}
          startTime={Date.now() - 60 * 1000}
          endTime={Date.now()}
          ruler={{
            visible: true,
            yLabel: (point: any) =>
              `${Number.parseFloat(point.value).toFixed(3)}`,
            timeLabel: (point: any) => point.timestamp,
          }}
        />
      );
    },
    {
      readme: {
        content: ruler,
      },
    }
  )
  .add(
    'Mouse events',
    () => {
      setupMocks();
      return (
        <TimeseriesChart
          timeseriesIds={[123]}
          startTime={Date.now() - 60 * 1000}
          endTime={Date.now()}
          onMouseMove={(e: any) => action('onMouseMove')(e)}
          onMouseOut={(e: any) => action('onMouseOut')(e)}
          onBlur={(e: any) => action('onBlur')(e)}
        />
      );
    },
    {
      readme: {
        content: mouseEvents,
      },
    }
  )
  .add(
    'Custom series',
    () => {
      setupMocks();
      const series = [
        {
          id: 123,
          color: 'green',
          yAxisDisplayMode: AxisDisplayMode.ALL,
          hidden: false,
          y0Accessor,
          y1Accessor,
          yAccessor,
        },
        {
          id: 456,
          color: 'red',
          y0Accessor,
          y1Accessor,
          yAccessor,
        },
      ];
      return <TimeseriesChart series={series} yAxisDisplayMode={'NONE'} />;
    },
    {
      readme: {
        content: customSeries,
      },
    }
  );
